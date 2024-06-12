<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;
    protected $table = 'brands';
    protected $primaryKey = 'id';
    public $timestamps = true; // To use created_at and updated_at fields
    protected $fillable = [
        'id',
        'brand_name',
        'logo',
        'description'
    ];

    public function products()
    {
        return $this->belongsTo(Product::class, 'brand_id');
    }
}
