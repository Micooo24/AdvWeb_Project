<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;
    protected $table = 'products';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'brand_id', 'supplier_id', 'description', 'cost', 'img_path'];

    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function feedbacks() {
        return $this->hasMany(Feedback::class);
    }

    public function suppliers() {
        return $this->belongsTo(Supplier::class);
    }

    public function brands() {
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
