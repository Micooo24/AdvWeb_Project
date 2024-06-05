<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Feedback extends Model
{
    use HasFactory;

    protected $fillable = ['customer_id', 'product_id', 'comments', 'img_path'];

    public function products() {
        return $this->belongsTo(Product::class);
    }

    public function customers() {
        return $this->belongsTo(Customer::class);
    }
}
