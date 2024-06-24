<?php

namespace App\Imports;

use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use App\Models\Supplier;

class SuppliersImport implements ToCollection, WithHeadingRow
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $rows)
    {
        foreach ($rows as $row)
        {
         Supplier::create([
             'name' => $row['name'],
             'email' => $row['email'],
             'contact_number'=> $row['contact_number'],
             'img_path'=> $row['img_path'],
         ]);

        }
    }
}
