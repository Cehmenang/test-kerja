import { Schema, model } from 'mongoose'

const marketingSchema = new Schema({
    marketing: { type: String, require: true }
}, { timestamps: false, collection: 'marketing' })

const penjualanSchema = new Schema({
    marketing_Id: { type: Number, require: true, unique: true },
    date: { type: Date, require: true },
    cargo_fee: { type: Number, require: true },
    total_balance: { type: Number, require: true },
    grand_total: { type: Number, require: true }
}, { timestamps: { createdAt: 'createdAt' }, collection: 'penjualan' })

const perhitunganSchema = new Schema({
    marketing: { type: String, require: true },
    bulan: { type: String, require: true },
    omzet: { type: Number },
    komisi: { type: String },
    komisiNominal: { type: Number }
}, { timestamps: { createdAt: 'createdAt' }, collection: 'perhitungan' } )

export const Marketing = model('marketing', marketingSchema)
export const Penjualan = model('penjualan', penjualanSchema)
export const Perhitungan = model('perhitungan', perhitunganSchema)