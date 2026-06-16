<div id="pair_edit_modal" class="modal fade"
    role="dialog">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">{{ __('Update Coin Pair') }}</h4>
                <button type="button" class="close"
                    data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                
                <div class="row">
                    <div class="col-md-6">
                        <input type="hidden" name="edit_id"
                            value="{{ encrypt($item->id) }}">
                        <div class="form-group text-left">
                            <label
                                class="form-label">{{ __('Base Coin') }}</label>
                            <select class=" form-control"
                                name="parent_coin_id"
                                style="width: 100%;">
                                <option value="">{{ __('Select') }}
                                </option>
                                @if (isset($coins[0]))
                                    @foreach ($coins as $coin)
                                        <option
                                            @if ($item->parent_coin_id == $coin->id) selected @endif
                                            value="{{ $coin->id }}">
                                            {{ check_default_coin_type($coin->coin_type) }}
                                        </option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group text-left">
                            <label
                                class="form-label">{{ __('Pair Coin') }}</label>
                            <select class=" form-control"
                                name="child_coin_id" style="width: 100%;">
                                <option value="">{{ __('Select') }}
                                </option>
                                @if (isset($coins[0]))
                                    @foreach ($coins as $coin)
                                        <option
                                            @if ($item->child_coin_id == $coin->id) selected @endif
                                            value="{{ $coin->id }}">
                                            {{ check_default_coin_type($coin->coin_type) }}
                                        </option>
                                    @endforeach
                                @endif
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group text-left">
                            <label
                                class="form-label">{{ __('Is this pair listed in bot api ?') }}</label>
                            <select class=" form-control"
                                name="pair_listed_api"
                                style="width: 100%;">
                                <option
                                    @if ($item->is_token == STATUS_ACTIVE) selected @endif
                                    value="2">{{ __('No') }}
                                </option>
                                <option
                                    @if ($item->is_token == STATUS_INACTIVE) selected @endif
                                    value="1">{{ __('Yes') }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="form-group text-left">
                            <label
                                class="form-label">{{ __('Digits after Decimal point') }}</label>

                            <select class="form-control"
                                name="pair_decimal" style="width: 100%;">
                                @foreach (range(2, 8) as $v)
                                    <option
                                        @if ($item->pair_decimal == $v) selected @endif
                                        value="{{ $v }}">
                                        {{ $v }}</option>
                                @endforeach
                            </select>
                            <p class="text-secondary sm-text">
                                {{ __('Select the number of digits after decimal point.') }}
                            </p>
                        </div>
                    </div>
                    @if (env('APP_MODE') == 'myDemo')
                        <div class="col-md-6">
                            <div class="form-group text-left">
                                <label
                                    class="form-label">{{ __('Last Price') }}</label>
                                <input type="text" class="form-control"
                                    name="price"
                                    value="{{ $item->price }}">
                            </div>
                        </div>
                    @endif
                </div>
                <div class="row">
                    <div class="col-md-4">
                        <button class="btn btn-info" style="width: 100%"
                            type="submit">{{ __('Update') }}</button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</div>