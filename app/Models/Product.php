<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    // Relasi: Satu Produk dimiliki oleh satu Kategori
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
    
    // Relasi Many-to-Many ke Order
    public function orders()
    {
        return $this->belongsToMany(Order::class, 'order_items')->withTimestamps();
    }
}
