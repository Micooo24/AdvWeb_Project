<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = ['brand_name', 'logo', 'description', 'img_path'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
