<?php

namespace App\Http\Services\DataTable;

use App\Model\WalletAddressHistory;
use App\Traits\DateFormatTrait;
use Illuminate\Support\Facades\DB;

class WalletAddressDataTableService
{
    use  DateFormatTrait;

    public function getData()
    {
        $address_list = DB::table('wallet_address_histories')
            ->join('wallets', 'wallets.id', '=', 'wallet_address_histories.wallet_id')
            ->join('users', 'users.id', '=', 'wallets.user_id')
            ->join('coins', 'coins.id', '=', 'wallets.coin_id')
            ->select(
                'wallet_address_histories.wallet_id',
                'wallet_address_histories.address',
                'wallet_address_histories.status',
                'wallet_address_histories.created_at',
                'users.email as user_email',
                'coins.coin_type as coin_type'
            );

        $address_network_list = DB::table('wallet_networks')
            ->join('wallets', 'wallets.id', '=', 'wallet_networks.wallet_id')
            ->join('users', 'users.id', '=', 'wallets.user_id')
            ->join('coins', 'coins.id', '=', 'wallets.coin_id')
            ->select(
                'wallet_networks.wallet_id',
                'wallet_networks.address',
                'wallet_networks.status',
                'wallet_networks.created_at',
                'users.email as user_email',
                'coins.coin_type as coin_type'
            );

        $combined_query = $address_list->union($address_network_list);
        $data = DB::table(DB::raw("({$combined_query->toSql()}) as combined"))
            ->mergeBindings($combined_query)
            ->orderByDesc('created_at');

        return datatables()->of($data)
            ->editColumn('status', function ($item) {
                return walletAddressStatus($item->status);
            })
            ->editColumn('created_at', function ($item) {
                return $this->dateFormat($item->created_at);
            })
            ->filterColumn('user_email', function ($query, $keyword) {
                $query->where('user_email', 'LIKE', "%$keyword%");
            })
            ->filterColumn('coin_type', function ($query, $keyword) {
                $query->where('coin_type', 'LIKE', "%$keyword%");
            })
            ->filterColumn('status', function ($query, $keyword) {
                $keyword = strtolower($keyword);
                $matchingCodes = array_keys(array_filter(WalletAddressHistory::STATUS_TEXT, function ($label) use ($keyword) {
                    return strpos(strtolower($label), $keyword) !== false;
                }));
                if (!empty($matchingCodes)) {
                    $query->whereIn('status', $matchingCodes);
                }
            })
            ->rawColumns(['status'])
            ->make(true);
    }
}
