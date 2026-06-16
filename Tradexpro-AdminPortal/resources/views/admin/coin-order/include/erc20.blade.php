<div class="col-md-6">
    <div class="form-group">
        <div class="controls">
            <div class="form-label">{{ __('Network Name') }}</div>
            <input type="text" class="form-control" name="network_name"
                value="{{ old('coin_api_port', $item->network_name) }}">
        </div>
    </div>
</div>

<div class="col-lg-6 col-12  mt-20">
    <div class="form-group">
        <label for="#">{{ __('Native Coin Code/Type') }}</label>
        <input class="form-control" type="text" name="contract_coin_name"
            placeholder="{{ __('Base Coin Name For Token Ex. ETH/BNB') }}"
            value="{{ old('contract_decimal', $item->contract_coin_name) }}">
    </div>
</div>
<div class="col-lg-6 col-12 mt-20">
    <div class="form-group">
        <label for="#">{{ __('RPC Node URL') }}</label>
        <input class="form-control" type="text" name="chain_link" required placeholder=""
            value="{{ old('contract_decimal', $item->chain_link) }}">
    </div>
</div>
{{-- <div class="col-lg-6 col-12 mt-20">
    <div class="form-group">
        <label for="#">{{ __('Chain ID') }}</label>
        <input class="form-control" type="text" name="chain_id" required placeholder=""
            value="{{ old('contract_decimal', $item->chain_id) }}">
    </div>
</div> --}}
<div class="col-lg-6 col-12 mt-20">
    <div class="form-group">
        <label for="#">{{ __('Contract Address') }}</label>
        <input class="form-control" type="text" name="contract_address" required placeholder=""
            value="{{ old('contract_decimal', $item->contract_address) }}">
    </div>
</div>

<div class="col-lg-6 col-12 mt-20">
    <div class="form-group">
        <label for="#">{{ __('Decimal') }}</label>
        <input type="number" name="contract_decimal" class="form-control"
            value="{{ old('contract_decimal', $item->contract_decimal) }}">
    </div>
</div>
<div class="col-lg-6 col-12 mt-20">
    <div class="form-group">
        <label for="#">{{ __('Gas Limit') }}</label>
        <input type="text" name="gas_limit" class="form-control"
            value="{{ old('contract_decimal', $item->gas_limit ?: 70000) }}">
    </div>
</div>

{{-- <div class="col-lg-6 col-12 mt-20">
        <div class="form-group">
            <label for="#">{{__('Last Block Number')}}</label>
            <input type="text" class="form-control" readonly
                @if (isset($item->last_block_number))
                    value="{{$item->last_block_number}}"
                @else
                    value="0"
                @endif
                >

        </div>
    </div> --}}

{{-- <div class="col-lg-6 col-12 mt-20">
        <div class="form-group">
            <label for="#">{{__('From Block Number')}}</label>
            <input name="from_block_number" type="text" class="form-control"
                @if (isset($item->from_block_number))
                    value="{{$item->from_block_number}}"
                @else
                    value="0"
                @endif
                >

        </div>
    </div> --}}

{{-- <div class="col-lg-6 col-12 mt-20">
        <div class="form-group">
            <label for="#">{{__('To Block Number')}}</label>
            <input name="to_block_number" type="text" class="form-control"
                @if (isset($item->to_block_number))
                    value="{{$item->to_block_number}}"
                @else
                    value="0"
                @endif
                >

        </div>
    </div> --}}
