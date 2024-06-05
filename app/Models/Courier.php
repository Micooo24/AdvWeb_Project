<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courier extends Model
{
    use HasFactory;

    protected $fillable = ['courier_name', 'contact_number', 'email', 'img_path'];

    public function orders() {
        return $this->hasMany(Order::class);
    }
}
