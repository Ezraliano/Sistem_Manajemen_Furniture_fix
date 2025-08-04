<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $guarded = ['id'];

    // Relasi: Satu Order dimiliki oleh satu User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relasi Many-to-Many ke Product
    public function products()
    {
        return $this->belongsToMany(Product::class, 'order_items')
                    ->withPivot('quantity', 'price')
                    ->withTimestamps();
    }
    
    // Relasi untuk mendapatkan semua item dalam order
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
}
