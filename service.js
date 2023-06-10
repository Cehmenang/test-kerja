import { Marketing, Penjualan, User, Pembayaran, Perhitungan } from './db/schema.js'
import bcrypt from 'bcrypt'

// Fungsi Membuat atau Update Perhitungan Marketing sesuai bulan dibuatnya Penjualan
async function createPerhitungan(marketingId, omzet, tanggalPembayaran){
    try{
        const bulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
        const getBulan = bulan[parseInt(tanggalPembayaran.split('/')[1])-1]
        const marketing = await Marketing.findOne({ _id: marketingId })
        let perhitungan = await Perhitungan.findOne({ marketing: marketing.name, bulan: getBulan })
        let komisi
        let komisiNominal
        if(!perhitungan){
            // Kondisi jika Marketing belum memiliki data Perhitungan pada bulan Penjualan dibuat
            if(omzet < 100000000) komisi = 0
            if(omzet >= 100000000 && omzet < 200000000) komisi = 2.5
            if(omzet >= 200000000 && omzet < 500000000) komisi = 5
            if(omzet >= 500000000) komisi = 10
            komisiNominal = (omzet * komisi)/100
            await Perhitungan.create({
                marketing: marketing.name,
                bulan: getBulan,
                omzet, komisi: `${komisi}%`, komisiNominal
            })
            perhitungan = await Perhitungan.findOne({ marketing: marketing.name, bulan: getBulan })
            return { msg: `Berhasil membuat perhitungan ${marketing.name} pada bulan ${getBulan}`, perhitungan}
        } else {
            // Kondisi saat Marketing sudah memiliki data Perhitungan pada bulan Penjualan dibuat
            perhitungan.omzet += omzet
            if(omzet < 100000000) komisi = 0
            if(omzet >= 100000000 && omzet < 200000000) komisi = 2.5
            if(omzet >= 200000000 && omzet < 500000000) komisi = 5
            if(omzet >= 500000000) komisi = 10
            komisiNominal = (perhitungan.omzet * komisi)/100
            perhitungan.komisi = `${komisi}%`
            perhitungan.komisiNominal = komisiNominal
            await perhitungan.save()
            return { msg: `Berhasil memperbarui perhitungan ${marketing.name} pada bulan ${getBulan}`, perhitungan }
        }
    }catch(err){ return { err: err.message } }
}

// Class Yang Memuat Berbagai Fungsi atau Method Service
class Service{

    // Fungsi Untuk Mengambil Semua Data Marketing
    async getAllMarketing(req, res){
        try{
            const marketing = await Marketing.find()
            if(!marketing) return res.status(400).json({ msg: "Belum ada marketing ditambahkan!" })
            return res.status(200).json(marketing)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

      // Fungsi Untuk Mengambil Semua Data Marketing
      async getAllUser(req, res){
        try{
            const users = await User.find()
            if(!users) return res.status(400).json({ msg: "Belum ada user ditambahkan!" })
            return res.status(200).json(users)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Semua Data Penjualan
    async getAllPenjualan(req, res){
        try{
            const penjualan = await Penjualan.find()
            if(!penjualan) return res.status(400).json({ msg: "Belum ada penjualan ditambahkan!" })
            return res.status(200).json(penjualan)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Semua Data Pembayaran
    async getAllPembayaran(req, res){
        try{
            const pembayaran = await Pembayaran.find()
            if(!pembayaran) return res.status(400).json({ msg: "Belum ada pembayaran ditambahkan!" })
            return res.status(200).json(pembayaran)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Semua Data Perhitungan
    async getAllPerhitungan(req, res){
        try{
            const perhitungan = await Perhitungan.find()
            if(!perhitungan) return res.status(400).json({ msg: "Belum ada perhitungan ditambahkan!" })
            return res.status(200).json(perhitungan)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Data Marketing Yang Dicari
    async getMarketing(req, res){
        try{
            const marketing = await Marketing.findOne({name: req.query.name})
            if(!marketing) return res.status(400).json({ msg: "Marketing tidak ditemukan!" })
            return res.status(200).json(marketing)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Data User Yang Dicari
    async getUser(req, res){
        try{
            const user = await User.findOne({ email: req.query.email })
            if(!user) return res.status(400).json({ msg: "User tidak ditemukan!" })
            return res.status(200).json(user)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Mengambil Data Pembayaran Yang Dicari
    async getPembayaran(req, res){
        try{
            const pembayaran = await Pembayaran.findOne({ transaction_number: req.query.transaction_number })
            if(!pembayaran) return res.status(400).json({ msg: "Pembayaran tidak ditemukan!" })
            return res.status(200).json(pembayaran)
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Membuat Akun User
    async createUser(req, res){
        try{
            const user = new User(req.body)
            const salt = await bcrypt.genSalt(5)
            user.password = await bcrypt.hash(user.password, salt)
            await user.save()
            return res.status(200).json({ msg: `User berhasil dibuat!`, user })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Membuat Akun Marketing
    async createMarketing(req, res){
        try{
            await Marketing.create(req.body)
            return res.status(200).json({ msg: `Marketing berhasil dibuat!`, marketing: req.body })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Membuat Penjualan
    async createPenjualan(req, res){
        try{    
            const penjualan = new Penjualan(req.body)
            !penjualan.cargo_fee ? penjualan.cargo_fee = 0 : true
            penjualan.grand_total = penjualan.cargo_fee + penjualan.total_balance
            await penjualan.save()
            return res.status(200).json({ msg: `Mohon untuk melanjutkan ke tahap pembayaran!`, penjualan })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Membuat Pembayaran
    async createPembayaran(req, res){
        try{
            const pesanan = await Penjualan.findOne({ transaction_number: req.body.transaction_number })
            const user = await User.findOne({ email: req.body.email })

            // Verifikasi Akun Sebelum Melakukan Pembayaran
            const verify = await bcrypt.compare(req.body.password, user.password)
            !verify ? res.status(400).json({ msg: 'Verifikasi password salah!' }) : true
            const pembayaran = new Pembayaran(req.body)
            pembayaran.user_id = user._id
            pembayaran.tanggal_pembayaran = pesanan.tanggal_penjualan    

            if(pembayaran.jenis_pembayaran == "kredit" && (req.body.jangka_waktu && req.body.jangka_waktu !== "1 bulan")){
                // Jika Pembayaran dilakukan secara Kredit
                pembayaran.jangka_waktu = req.body.jangka_waktu
                const kredit = parseInt(pembayaran.jangka_waktu.split(' ')[0])
                pembayaran.nominal = Math.round(pesanan.grand_total / kredit)
                pembayaran.status = `Sisa ${kredit - 1} bulan`
            } else { 
                // Jika Pembayaran dilakukan secara Kontan
                pembayaran.nominal = pesanan.grand_total
                pembayaran.status = "lunas"
            }
            user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo -= pembayaran.nominal

            // Pembayaran selesai dan save data yang sudah diolah pada proses Pembayaran
            await user.save()
            await pembayaran.save()

            // Setelah proses Pembayaran, membuat Perhitungan Marketing dari Penjualan
            const perhitunganMsg = await createPerhitungan(pesanan.marketing_Id, pembayaran.nominal, pembayaran.tanggal_pembayaran) || "kosong"

            // End Point berupa pesan Pembayaran sukses dan sisa saldo bank pengguna
            return res.status(200).json({ 
                msg: pembayaran.jenis_pembayaran == "kredit" ? `Pembayaran berhasil!, tagihan ${pembayaran.status}.` : 'Pembayaran berhasil!',
                saldo: `Sisa saldo ${pembayaran.metode_pembayaran}: ${user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo}.`,
                pembayaran, perhitunganMsg
            })
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

    // Fungsi Untuk Membayar Tagihan Kredit Pembayaran
    async bayarKredit(req, res){
        try{
            const user = await User.findOne({ _id: req.query.user_id })
            const pembayaran = await Pembayaran.findOne({ transaction_number: req.query.transaction_number, user_id: req.query.user_id })

            // Melakukan pengecekan kepada Pembayaran, apakah sudah lunas atau belum
            if(pembayaran.status == "lunas") return res.status(200).json({ msg: 'Pembayaran sudah lunas!' })

            // Logika proses Pembayaran tagihan kredit sesuai jangka waktu kredit
            const pesanan = await Penjualan.findOne({ transaction_number: req.query.transaction_number })
            const kredit = parseInt(pembayaran.status.split(' ')[1])
            const sisaBayar = Math.round((pesanan.grand_total - pembayaran.nominal) / kredit)
            pembayaran.nominal += sisaBayar
            user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo -= sisaBayar

            // Kondisi apabila saldo bank yang ditentukan tidak mencukupi untuk melakukan pembayaran
            if(user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo < 0) return res.status(400).json({ msg: `Maaf, saldo anda tidak cukup untuk melakukan pembayaran!` })

            // Memperbarui status pembayaran
            if(kredit == 1) pembayaran.status = `lunas`
            else pembayaran.status = `Sisa ${kredit - 1} bulan`

            // Proses Pembayaran Kredit telah selesai, dan data akan diperbarui dengan save
            await user.save()
            await pembayaran.save()

            // Membuat Perhitungan Marketing untuk tagihan yang telah dibayarkan
            const perhitunganMsg = await createPerhitungan(pesanan.marketing_Id, sisaBayar, req.query.tanggal_pembayaran) || "kosong"

            // End Point berupa pesan Pembayaran berhasil dan sisa saldo bank pengguna
            res.status(200).json({ 
                msg: `Tagihan berhasil dibayar. Sisa saldo: ${user.rekening.filter(rek=>rek.bank == pembayaran.metode_pembayaran)[0].saldo}`, 
            pembayaran, perhitunganMsg})
        }catch(err){ res.status(400).json({ msg: err.message }) }
    }

} 

export default new Service()