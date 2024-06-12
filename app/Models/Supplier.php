<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Supplier extends Model
{
    use HasFactory;

    protected $table = 'suppliers';
    protected $primaryKey = 'id';

    protected $fillable = ['name', 'email', 'contact_number', 'img_path'];

    public function products()
    {
        return $this->hasMany(Product::class, 'supplier_id');
    }


}
