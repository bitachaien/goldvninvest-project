<?php

namespace App\Http\Services\DataTable;

use App\Model\WithdrawHistory;
use App\Traits\DateFormatTrait;
use App\Traits\NumberFormatTrait;

class WithdrawalHistoryDataTableService
{
    use NumberFormatTrait, DateFormatTrait;

    public function getData($status = null)
    {
        $withdrawal = WithdrawHistory::orderBy('id', 'desc')
            ->when(isset($status), function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->select('withdraw_histories.*');

        return datatables()->of($withdrawal)
            ->filterColumn('id', function ($query, $keyword) {
                if(!str_contains($keyword, '@')) return;
                $query->with('user')->whereHas('user', function($q) use ($keyword){
                    return $q->where('email', $keyword);
                });
            })
            ->filterColumn('status', function ($query, $keyword) {
                $keyword = strtolower($keyword);
                $matchingCodes = array_keys(array_filter(WithdrawHistory::STATUS_TEXT, function ($label) use ($keyword) {
                    return strpos(strtolower($label), $keyword) !== false;
                }));
                if (!empty($matchingCodes)) {
                    $query->whereIn('status', $matchingCodes);
                }
            })
            ->filterColumn('address_type', function ($query, $keyword) {
                $keyword = strtolower($keyword);
                $matchingCodes = array_keys(array_filter(addressType(), function ($label) use ($keyword) {
                    return strpos(strtolower($label), $keyword) !== false;
                }));
                if (!empty($matchingCodes)) {
                    $query->whereIn('address_type', $matchingCodes);
                }
            })
            ->editColumn('status', function ($item) {
                return withdrawalStatus($item->status);
            })
            ->editColumn('address_type', function ($item) {
                return addressType($item->address_type);
            })
            ->editColumn('amount', function ($item) {
                return $this->truncateNum($item->amount);
            })
            ->editColumn('coin_type', function ($item) {
                return find_coin_type($item->coin_type);
            })
            ->editColumn('updated_at', function ($item) {
                return $this->dateFormat($item->updated_at);
            })
            ->addColumn('actions', function ($item) {
                $action = [
                    'id' => encrypt($item->id),
                    'rejectPendingWithdrawalRoute' => route('adminRejectPendingWithdrawal'),
                ];
                switch ($item->status) {
                    case WithdrawHistory::PENDING:
                        $action['acceptPendingWithdrawalRoute'] = route('adminAcceptPendingWithdrawal', encrypt($item->id));
                        $action['status'] = $item->status;
                        break;
                    case WithdrawHistory::FAILED:
                        $action['acceptPendingWithdrawalRoute'] = route('adminAcceptPendingWithdrawal', encrypt($item->id));
                        $action['asAcceptPendingWithdrawalRoute'] = route('adminMakeAsWithdrawalSuccess');
                        $action['status'] = $item->status;
                        break;
                }
                return $action;
            })
            // ->addColumn('actions', function ($item) {
            //     $action = '<div class="activity-icon"><ul style="gap: 10px">';
            //     $action .= accept_html('adminAcceptPendingWithdrawal', encrypt($item->id));
            //     $action .= reject_html('adminRejectPendingWithdrawal', encrypt($item->id));
            //     $action .= '</ul> </div>';

            //     return $action;
            // })
            ->rawColumns(['status', 'address_type', 'coin_type', 'updated_at', 'actions'])
            ->make(true);
    }
}
