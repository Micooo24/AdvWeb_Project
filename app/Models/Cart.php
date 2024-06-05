<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
    use HasFactory;
    protected $primaryKey = null;
    public $incrementing = false;
    protected $fillable = ['customer_id', 'product_id','cart_qty'];

    public function customers() {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function products() {
        return $this->belongsTo(Product::class, 'product_id');
    }
}
