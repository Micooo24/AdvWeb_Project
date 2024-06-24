<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Product;

class ProductsImport implements ToCollection, WithHeadingRow
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row)
        {
         Product::create([
            'name' => $row['name'],
            'brand_id' => $row['brand_id'],
            'supplier_id' => $row['supplier_id'],
            'description' => $row['description'],
            'cost' => $row['cost'],
            'img_path' => $row['img_path'],
         ]);

        }
    }
}
