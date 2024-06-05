<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'brand_id', 'supplier_id', 'description', 'cost', 'img_path'];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function feedbacks() {
        return $this->hasMany(Feedback::class);
    }

    public function supplier() {
        return $this->belongsTo(Supplier::class);
    }

    public function brand() {
        return $this->belongsTo(Brand::class);
    }

    public function orders() {
        return $this->belongsToMany(Order::class, 'order_has_products', 'order_id', 'product_id')->withPivot('quantity');
    }

    public function carts()
    {
        return $this->hasMany(Cart::class, 'product_id');
    }
}
