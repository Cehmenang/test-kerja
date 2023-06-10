import { Marketing, Penjualan, User, Pembayaran, Perhitungan } from './db/schema.js'
import bcrypt from 'bcrypt'

async function createPerhitungan(marketingId, omzet){
    try{
        const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const marketing = await Marketing.findOne({ _id: marketingId })
        let perhitungan = await Perhitungan.findOne({ marketing: marketing.name, bulan: bulan[new Date().getMonth() + 1] })
        let komisi
        let komisiNominal
        if(!perhitungan){
            if(omzet < 100000000) komisi = 0
            if(omzet >= 100000000 && omzet < 200000000) komisi = 2.5
            if(omzet >= 200000000 && omzet < 500000000) komisi = 5
            if(omzet >= 500000000) komisi = 10
            komisiNominal = (omzet * komisi)/100
            await Perhitungan.create({
                marketing: marketing.name,
                bulan: bulan[new Date().getMonth()+1],
                omzet, komisi: `${komisi}%`, komisiNominal
            })
            perhitungan = await Perhitungan.findOne({ marketing: marketing.name, bulan: bulan[new Date().getMonth()+1] })
            return { msg: `Berhasil membuat perhitungan ${marketing.name} pada bulan ${bulan[new Date().getMonth()+1]}`, perhitungan}
        } else {
            perhitungan.omzet += omzet
            if(omzet < 100000000) komisi = 0
            if(omzet >= 100000000 && omzet < 200000000) komisi = 2.5
            if(omzet >= 200000000 && omzet < 500000000) komisi = 5
            if(omzet >= 500000000) komisi = 10
            komisiNominal = (perhitungan.omzet * komisi)/100
            perhitungan.komisi = `${komisi}%`
            perhitungan.komisiNominal = komisiNominal
            await perhitungan.save()
            return { msg: `Berhasil memperbarui perhitungan ${marketing.name} pada bulan ${bulan[new Date().getMonth()+1]}`, perhitungan }
        }
    }catch(err){ return { err: err.message } }
}

class Service{

    async getAllMarketing(req, res){
        try{
            const marketing = await Marketing.find()
            if(!marketing) return res.status(400).json({ msg: "Belum ada marketing ditambahkan!" })
            return res.status(200).json(marketing)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async getAllPenjualan(req, res){
        try{
            const penjualan = await Penjualan.find()
            if(!penjualan) return res.status(400).json({ msg: "Belum ada penjualan ditambahkan!" })
            return res.status(200).json(penjualan)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async getAllPembayaran(req, res){
        try{
            const pembayaran = await Pembayaran.find()
            if(!pembayaran) return res.status(400).json({ msg: "Belum ada pembayaran ditambahkan!" })
            return res.status(200).json(pembayaran)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async getAllPerhitungan(req, res){
        try{
            const perhitungan = await Perhitungan.find()
            if(!perhitungan) return res.status(400).json({ msg: "Belum ada perhitungan ditambahkan!" })
            return res.status(200).json(perhitungan)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async getMarketing(req, res){
        try{
            const marketing = await Marketing.findOne({name: req.query.name})
            if(!marketing) return res.status(400).json({ msg: "Marketing tidak ditemukan!" })
            return res.status(200).json(marketing)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async getUser(req, res){
        try{
            const user = await User.findOne({ email: req.query.email })
            if(!user) return res.status(400).json({ msg: "User tidak ditemukan!" })
            return res.status(200).json(user)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async createUser(req, res){
        try{
            const user = new User(req.body)
            const salt = await bcrypt.genSalt(5)
            user.password = await bcrypt.hash(user.password, salt)
            await user.save()
            return res.status(200).json({ msg: `User berhasil dibuat!`, user })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async createMarketing(req, res){
        try{
            await Marketing.create(req.body)
            return res.status(200).json({ msg: `Marketing berhasil dibuat!`, marketing: req.body })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async createPenjualan(req, res){
        try{    
            const penjualan = new Penjualan(req.body)
            !penjualan.cargo_fee ? penjualan.cargo_fee = 0 : true
            penjualan.grand_total = penjualan.cargo_fee + penjualan.total_balance
            await penjualan.save()
            return res.status(200).json({ msg: `Mohon untuk melanjutkan ke tahap pembayaran!`, penjualan })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async createPembayaran(req, res){
        try{
            const pesanan = await Penjualan.findOne({ transaction_number: req.body.transaction_number })
            const user = await User.findOne({ email: req.body.email })
            const verify = await bcrypt.compare(req.body.password, user.password)
            !verify ? res.status(400).json({ msg: 'Verifikasi password salah!' }) : true
            const pembayaran = new Pembayaran(req.body)
            pembayaran.user_id = user._id      
            if(pembayaran.jenis_pembayaran == "kredit" && (req.body.jangka_waktu && req.body.jangka_waktu !== "1 bulan")){
                pembayaran.jangka_waktu = req.body.jangka_waktu
                const kredit = parseInt(pembayaran.jangka_waktu.split(' ')[0])
                pembayaran.nominal = Math.round(pesanan.grand_total / kredit)
                pembayaran.status = `Sisa ${kredit - 1} bulan`
            } else { 
                pembayaran.nominal = pesanan.grand_total
                pembayaran.status = "lunas"
            }
            user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo -= pembayaran.nominal
            await user.save()
            await pembayaran.save()
            const perhitunganMsg = await createPerhitungan(pesanan.marketing_Id, pembayaran.nominal) || "kosong"
            return res.status(200).json({ 
                msg: pembayaran.jenis_pembayaran == "kredit" ? `Pembayaran berhasil!, tagihan ${pembayaran.status}.` : 'Pembayaran berhasil!',
                saldo: `Sisa saldo ${pembayaran.metode_pembayaran}: ${user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo}.`,
                pembayaran, perhitunganMsg
            })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    async bayarKredit(req, res){
        try{
            const user = await User.findOne({ _id: req.query.user_id })
            const pembayaran = await Pembayaran.findOne({ transaction_number: req.query.transaction_number, user_id: req.query.user_id })
            if(pembayaran.status == "lunas") return res.status(200).json({ msg: 'Pembayaran sudah lunas!' })
            const pesanan = await Penjualan.findOne({ transaction_number: req.query.transaction_number })
            const kredit = parseInt(pembayaran.status.split(' ')[1])
            const sisaBayar = Math.round((pesanan.grand_total - pembayaran.nominal) / kredit)
            pembayaran.nominal += sisaBayar
            user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo -= sisaBayar
            if(user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo < 0) return res.status(400).json({ msg: `Maaf, saldo anda tidak cukup untuk melakukan pembayaran!` })
            if(kredit == 1) pembayaran.status = `lunas`
            else pembayaran.status = `Sisa ${kredit - 1} bulan`
            await user.save()
            await pembayaran.save()
            const perhitunganMsg = await createPerhitungan(pesanan.marketing_Id, sisaBayar) || "kosong"
            res.status(200).json({ 
                msg: `Tagihan berhasil dibayar. Sisa saldo: ${user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo}` 
            }, pembayaran, perhitunganMsg)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

} 

export default new Service()