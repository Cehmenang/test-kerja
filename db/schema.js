import { Schema, model } from 'mongoose'

// Skema Field Rekening yang menjadi anak dari Field User
const rekeningSchema = new Schema({
    bank: { type: String, require: true },
    saldo: { type: Number, require: true }
})

// Skema Field User
const userSchema = new Schema({
    name: { type: String, require: true, unique: true },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    rekening: [rekeningSchema]
})

// Skema Field Marketing
const marketingSchema = new Schema(
    { name: { type: String, require: true, unique: true } },
    { timestamps: false, collection: 'marketing' }
)

// Skema Field Penjualan
const penjualanSchema = new Schema({
    transaction_number: { type: String, require: true, unique: true },
    marketing_Id: { type: String, require: true },
    cargo_fee: { type: Number, require: true, defaultValue: 0 },
    total_balance: { type: Number, require: true },
    grand_total: { type: Number, require: true, defaultValue: 0 },
    tanggal_penjualan: { type: String, require: true }
}, { timestamps: { createdAt: 'date', updatedAt: false }, collection: 'penjualan' })

// Skema Field Pembayaran
const pembayaranSchema = new Schema({
    transaction_number: { type: String, require: true, unique: true },
    user_id: { type: String, require: true },
    metode_pembayaran: { type: String, require: true },
    jenis_pembayaran: { type: String, require: true },
    nominal: { type: Number, require: true },
    status: { type: String, require: true },
    jangka_waktu: { type: String },
    tanggal_pembayaran: { type: String, require: true }
}, { timestamps: { createdAt: 'date' }, collection: 'pembayaran' })

// Skema Field Perhitungan
const perhitunganSchema = new Schema({
    marketing: { type: String, require: true },
    bulan: { type: String, require: true },
    omzet: { type: Number },
    komisi: { type: String },
    komisiNominal: { type: Number }
}, { timestamps: true, collection: 'perhitungan' } )

// Model Dokumen dari Skema yang telah dibuat
export const User = model('user', userSchema)
export const Marketing = model('marketing', marketingSchema)
export const Penjualan = model('penjualan', penjualanSchema)
export const Pembayaran = model('pembayaran', pembayaranSchema)
export const Perhitungan = model('perhitungan', perhitunganSchema)