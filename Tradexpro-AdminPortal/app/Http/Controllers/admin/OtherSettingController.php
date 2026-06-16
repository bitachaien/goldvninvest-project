<?php

namespace App\Http\Controllers\admin;

use App\User;
use App\Model\Coin;
use App\Model\Wallet;
use App\Model\CoinPair;
use App\Model\AdminLoginActivity;
use App\Model\WalletNetwork;
use Illuminate\Http\Request;
use App\Model\WithdrawHistory;
use App\Model\DepositeTransaction;
use Illuminate\Support\Facades\DB;
use App\Model\WalletAddressHistory;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Services\OtherSettingService;

class OtherSettingController extends Controller
{
    private $service;
    public function __construct()
    {
        $this->service = new OtherSettingService();
    }

    public function otherSetting()
    {
        $data['tab'] = 'address_delete';
        if (isset($_GET['tab'])) {
            $data['tab'] = $_GET['tab'];
        }
        $data['title'] = __('Other Settings');
        $data['settings'] = allsetting();

        if ($data['tab'] == 'address_delete') {
            $data['coins'] = Coin::get('coin_type');
        }

        $data['coin_pairs'] = CoinPair::select(
            'coin_pairs.id',
            'parent_coin_id',
            'child_coin_id',
            'coin_pairs.volume',
            'coin_pairs.is_token',
            'coin_pairs.bot_trading',
            'coin_pairs.initial_price',
            'coin_pairs.bot_possible',
            DB::raw("visualNumberFormat(price) as last_price"),
            DB::raw("TRUNCATE(`change`,2) as price_change"),
            "high",
            "low",
            'child_coin.coin_type as child_coin_name',
            'child_coin.coin_icon as icon',
            'parent_coin.coin_type as parent_coin_name',
            'child_coin.name as child_full_name',
            'parent_coin.name as parent_full_name',
            DB::raw('CONCAT(child_coin.coin_type,"_",parent_coin.coin_type) as pair_bin'),
            DB::raw('CONCAT(child_coin.coin_type,"_",parent_coin.coin_type) as coin_pair_coin')
        )
            ->join('coins as child_coin', ['coin_pairs.child_coin_id' => 'child_coin.id'])
            ->join('coins as parent_coin', ['coin_pairs.parent_coin_id' => 'parent_coin.id'])
            ->where(['coin_pairs.status' => STATUS_ACTIVE])
            ->orderBy('is_default', 'desc')
            ->get();

        return view('admin.settings.other', $data);
    }

    public function deleteWalletAddress(Request $request)
    {
        return $this->handlerResponseAndRedirect(function () use ($request) {
            return $this->service->deleteWalletAddress($request, auth()->user());
        });
    }

    // check outside market rate
    public function checkOutsideMarketRate(Request $request)
    {
        $redirect = redirect()->route('otherSetting', ['tab' => 'coin_pairs'])->withInput();
        try {
            if (empty($request->coin_pair)) {
                return $redirect->with("dismiss", __("Please select coin pair first"));
            }
            $reqData = explode('#', $request->coin_pair);

            $rate = getPriceFromApi($reqData[0]);
            if ($rate['success'] == false) {
                CoinPair::where(['id' => intval($reqData[1])])->update(['is_token' => 1]);
                return $redirect->with("dismiss", __("Get rate failed"));
            } else {
                CoinPair::where(['id' => intval($reqData[1])])->update(['is_token' => 2]);
                return $redirect->with("success", __("Get rate success, rate = ") . $rate['data']['price']);
            }
        } catch (\Exception $e) {
            storeException("checkOutsideMarketRate", $e->getMessage());
            return $redirect->with("dismiss", __("Something went wrong"));
        }
    }

    // delete coin pair chart data
    public function deleteCoinPairChartData(Request $request)
    {
        if (env('APP_MODE') == 'demo') {
            return ['success' => false, 'message' => __('Currently disable only for demo')];
        }
        $redirect = redirect()->route('otherSetting', ['tab' => 'coin_pairs'])->withInput();
        DB::beginTransaction();
        try {
            if (empty($request->pair_id)) {
                return $redirect->with("dismiss", __("Please select coin pair first"));
            }
            $pair = CoinPair::find($request->pair_id);
            if (!($pair)) {
                return $redirect->with("dismiss", __("Coin pair not found"));
            }
            if (empty($request->password)) {
                return $redirect->with("dismiss", __("Password is required"));
            }

            if (!$admin = User::where("id", auth()->id())->first()) {
                return $redirect->with("dismiss", __("Admin not found"));
            }

            if (!(Hash::check($request->password, $admin->password))) {
                return $redirect->with("dismiss", __("Password is incorrect"));
            }
            DB::table('tv_chart_5mins')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();
            DB::table('tv_chart_15mins')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();
            DB::table('tv_chart_30mins')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();
            DB::table('tv_chart_2hours')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();
            DB::table('tv_chart_4hours')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();
            DB::table('tv_chart_1days')->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])->delete();

            $pair->update(['is_chart_updated' => 0]);
            DB::commit();
            return $redirect->with("success", __("Data deleted successfully"));
        } catch (\Exception $e) {
            DB::rollBack();
            storeException("deleteCoinPairChartData", $e->getMessage());
            return $redirect->with("dismiss", __("Something went wrong"));
        }
    }

    // update coin pair with token
    public function updatePairWithToken(Request $request)
    {
        if (env('APP_MODE') == 'demo') {
            return ['success' => false, 'message' => __('Currently disable only for demo')];
        }
        $redirect = redirect()->route('otherSetting', ['tab' => 'coin_pairs'])->withInput();
        DB::beginTransaction();
        try {

            if (empty($request->pair_id)) {
                return $redirect->with("dismiss", __("Please select coin pair first"));
            }
            $pair = CoinPair::find($request->pair_id);
            if (!($pair)) {
                return $redirect->with("dismiss", __("Coin pair not found"));
            }
            if (empty($request->is_token)) {
                return $redirect->with("dismiss", __("Select token or native"));
            }
            if (empty($request->password)) {
                return $redirect->with("dismiss", __("Password is required"));
            }
            if (!$admin = User::where("id", auth()->id())->first()) {
                return $redirect->with("dismiss", __("Admin not found"));
            }
            if (!(Hash::check($request->password, $admin->password))) {
                return $redirect->with("dismiss", __("Password is incorrect"));
            }
            if ($pair->is_token == $request->is_token) {
                return $redirect->with("dismiss", __("Already used this"));
            }
            $token = $request->is_token == STATUS_ACTIVE ? 1 : 0;
            $pair->update(['is_token' => $token]);
            DB::commit();
            return $redirect->with("success", __("Data updated successfully"));
        } catch (\Exception $e) {
            DB::rollBack();
            storeException("updatePairWithToken", $e->getMessage());
            return $redirect->with("dismiss", __("Something went wrong"));
        }
    }

    // delete coin pair bot order data
    public function deleteCoinPairOrderData(Request $request)
    {

        if (env('APP_MODE') == 'demo') {
            return ['success' => false, 'message' => __('Currently disabled only for demo')];
        }

        $redirect = redirect()->route('otherSetting', ['tab' => 'coin_pairs'])->withInput();

        if (empty($request->pair_id)) {
            return $redirect->with("dismiss", __("Please select coin pair first"));
        }

        $pair = CoinPair::find($request->pair_id);

        if (!($pair)) {
            return $redirect->with("dismiss", __("Coin pair not found"));
        }

        if (empty($request->password)) {
            return $redirect->with("dismiss", __("Password is required"));
        }

        if (!$admin = User::where("id", auth()->id())->first()) {
            return $redirect->with("dismiss", __("Admin not found"));
        }

        if (!(Hash::check($request->password, $admin->password))) {
            return $redirect->with("dismiss", __("Password is incorrect"));
        }

        $superAdminId = get_super_admin_id();

        if ($superAdminId == 0) {
            return $redirect->with("dismiss", __("Super Admin is not available"));
        }

        DB::beginTransaction();

        try {

            DB::table('transactions')
                ->where(['base_coin_id' => $pair->parent_coin_id, 'trade_coin_id' => $pair->child_coin_id])
                ->where('buy_user_id', $superAdminId)
                ->where('sell_user_id', $superAdminId)
                ->delete();

            DB::table('buys')
                ->where('user_id', $superAdminId)
                ->where('base_coin_id', $pair->parent_coin_id)
                ->where('trade_coin_id', $pair->child_coin_id)
                ->whereNotIn('id', function ($query) {
                    $query->select('buy_id')
                        ->from('transactions');
                })->delete();

            DB::table('sells')
                ->where('user_id', $superAdminId)
                ->where('base_coin_id', $pair->parent_coin_id)
                ->where('trade_coin_id', $pair->child_coin_id)
                ->whereNotIn('id', function ($query) {
                    $query->select('sell_id')
                        ->from('transactions');
                })->delete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            storeException("deleteCoinPairOrderData", $e->getMessage());
            return $redirect->with("dismiss", __("Something went wrong"));
        }

        return $redirect->with("success", __("Data deleted successfully"));
    }

    public function adminLoginActivity(Request $request)
    {
        if(IS_API_CALL){
            $adminLoginActivities = AdminLoginActivity::with('admin');
            return datatables()->of($adminLoginActivities)
                ->addColumn('admin_name', fn($row) => ($row->admin?->first_name ?? "") ." ". ($row->admin?->last_name ?? ''))
                ->make();
        }
        $data['title'] = __('Login Activity');
        return view('admin.role.activity', $data);
    }
}
