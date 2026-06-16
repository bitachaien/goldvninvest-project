<div class="header-bar">
    <div class="table-title">
        <h3>{{ __('Coin Payment Details') }}</h3>
    </div>
</div>
<div class="profile-info-form">
    <div class="row">
        <div class="col-lg-6 col-12 mt-20">
            <div class="form-group">
                <label for="#">{{ __('COIN PAYMENT VERSION') }}</label>
                @if (env('APP_MODE') == 'demo')
                    <input class="form-control" value="{{ 'disablefordemo' }}">
                @else
                    <select name="coin_payment_active_version" id="coin_payment_active_version" class="form-control" data-width="100%" data-style="btn-dark">
                        {!! \App\Enums\CoinPaymentActiveVersion::toSelectOptions($settings['COIN_PAYMENT_VERSION'] ?? 1) !!}
                    </select>
                    <p class="text-danger">
                        Alert! : {{ __('Switching to another CoinPayments API version will invalidate all existing wallet addresses currently assigned to your users.') }}
                    </br>Alert! : {{ __('Ensure all pending withdrawals are completed before upgrading.') }}
                    </p>
                <button type="button" class="button-primary theme-btn" data-toggle="modal" data-target="#viewCoinPaymentChangeModal">
                    {{ __('Update Version') }}
                </button>
                @endif
            </div>
        </div>
    </div>
    <div class="coin_payment_v1_element">
        <form action="{{ route('adminSavePaymentSettings') }}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="table-title">
                <h4 class="text-white">{!! \App\Enums\CoinPaymentActiveVersion::LEGACY->getVersionName() !!} {{ __("Details") }}</h4>
            </div><hr>
            <div class="row">
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT PUBLIC KEY') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="text" name="COIN_PAYMENT_PUBLIC_KEY" autocomplete="off"
                                placeholder="" value="{{ $settings['COIN_PAYMENT_PUBLIC_KEY'] ?? '' }}">
                        @endif
                    </div>
                </div>
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT PRIVATE KEY') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="text" name="COIN_PAYMENT_PRIVATE_KEY" autocomplete="off"
                                placeholder="" value="{{ $settings['COIN_PAYMENT_PRIVATE_KEY'] ?? '' }}">
                        @endif

                    </div>
                </div>
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT IPN MERCHANT ID') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="text" name="ipn_merchant_id" autocomplete="off"
                                placeholder="" value="{{ $settings['ipn_merchant_id'] ?? '' }}">
                        @endif
                    </div>
                </div>
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT IPN SECRET') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="text" name="ipn_secret" autocomplete="off" placeholder=""
                                value="{{ $settings['ipn_secret'] ?? '' }}">
                        @endif
                    </div>
                </div>
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('Withdrawal email verification enable / disable') }}</label>
                        <div class="cp-select-area">
                            <select name="coin_payment_withdrawal_email" class="form-control">
                                <option @if (isset($settings['coin_payment_withdrawal_email']) && $settings['coin_payment_withdrawal_email'] == STATUS_ACTIVE) selected @endif value="{{ STATUS_ACTIVE }}">
                                    {{ __('Yes') }}</option>
                                <option @if (isset($settings['coin_payment_withdrawal_email']) && $settings['coin_payment_withdrawal_email'] == STATUS_PENDING) selected @endif value="{{ STATUS_PENDING }}">
                                    {{ __('No') }}</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-12 mt-20">
                    <button type="submit" class="button-primary theme-btn">{{ __('Update') }}</button>
                </div>
            </div>
        </form>
    </div>
    <div class="coin_payment_v2_element">
        <form action="{{ route('adminSaveCoinPaymentV2Settings') }}" method="post" enctype="multipart/form-data">
            @csrf
            <div class="table-title">
                <h4 class="text-white">{!! \App\Enums\CoinPaymentActiveVersion::COIN_PAYMENT_V2->getVersionName() !!} {{ __("Details") }}</h4>
            </div><hr>
            <div class="row">
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT CLIENT ID') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="text" name="COIN_PAYMENT_V2_CLIENT_ID" autocomplete="off"
                                placeholder="" value="{{ $settings['COIN_PAYMENT_V2_CLIENT_ID'] ?? '' }}">
                        @endif
                    </div>
                </div>
                <div class="col-lg-6 col-12 mt-20">
                    <div class="form-group">
                        <label for="#">{{ __('COIN PAYMENT SECRET ID') }}</label>
                        @if (env('APP_MODE') == 'demo')
                            <input class="form-control" value="{{ 'disablefordemo' }}">
                        @else
                            <input class="form-control" type="password" name="COIN_PAYMENT_V2_SECRET_ID" autocomplete="off"
                                placeholder="" value="{{ $settings['COIN_PAYMENT_V2_SECRET_ID'] ?? '' }}">
                        @endif

                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-2 col-12 mt-20">
                    <button type="submit" class="button-primary theme-btn">{{ __('Update') }}</button>
                </div>
            </div>
        </form>
    </div>
</div>

<div id="viewCoinPaymentChangeModal" class="modal fade delete" role="dialog">
    <div class="modal-dialog modal-md">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">
                    {{__('Update CoinPayment Version')}}
                </h6>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <form id="view_wallet_key_submit_form">
                @csrf
                <div class="modal-body">
                <p class="text-danger">
                    Alert! : {{ __('Switching to another CoinPayments API version will invalidate all existing wallet addresses currently assigned to your users.') }}
                    </br>
                    Alert! : {{ __('Ensure all pending withdrawals are completed before upgrading.') }}
                </p>
                    <div class="row">
                        <input type="hidden" name="id" value="">
                        <div class="col-md-12" id="user_password_input_details">
                            <div class="form-group">
                                <label for="#">{{__('Enter Your Password')}}</label>
                                <input id="view_wallet_key_user_password" type="password" name="password" class="form-control">
                            </div>
                        </div>
                        @if(adminGoogleAuthEnabled())
                            <div class="col-md-12" id="user_password_google_authenticator_input_details">
                                <div class="form-group">
                                    <label for="#">{{__('Google Authenticator Code')}}</label>
                                    <input id="view_wallet_key_google_authenticator" type="text" name="google_authenticator" class="form-control">
                                </div>
                            </div>
                        @endif
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" data-dismiss="modal">
                        {{__("Cancel")}}
                    </button>
                    <button type="button" id="coin_payment_active_version_submit" class="btn theme-btn">
                        {{__('Confirm')}}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

@if(false)
<div class="user-management pt-4 coin_payment_v1_element">
    <div class="row">
        <div class="col-12">
            <div class="header-bar">
                <div class="table-title">
                    <h3>{{ __('CoinPayment Network Records') }}</h3>
                </div>
                <div class="right d-flex align-items-center">
                    <div class="add-btn-new mb-2 mr-1">
                        <button id="sync_fees" class="float-right btn"
                            style="background: #ffba00; color: white">{{ __('Sync form CoinPayment') }}</button>
                    </div>
                </div>
            </div>
            <div class="table-area">

                <table id="withdrawTable" class=" table table-borderless custom-table display text-lg-center"
                    width="100%">
                    <thead>
                        <tr>
                            <th class="all">{{ __('Coin type') }}</th>
                            <th class="desktop">{{ __('BTC rate') }}</th>
                            <th class="desktop">{{ __('Tx rate') }}</th>
                            <th class="desktop">{{ __('Is fiat') }}</th>
                            <th class="desktop">{{ __('status') }}</th>
                            <th class="desktop">{{ __('Last Update') }}</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>

            </div>
        </div>
    </div>
</div>
@endif