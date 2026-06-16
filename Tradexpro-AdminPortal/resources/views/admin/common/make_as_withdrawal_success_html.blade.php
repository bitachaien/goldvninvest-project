<div id="make_as_withdrawal_success_modal" class="modal fade delete" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">{{ __('Make as withdrawal success') }}</h6>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <form action="#" method="post">
                @csrf
                <input type="hidden" name="id" value="" />
                <div class="modal-body">
                    <p>{{ __('Do you want to make as withdrawal success ?') }}</p>
                    <div class="form-group">
                        <label>{{ __('Transaction Hash:') }}</label>
                        <input type="text" name="transaction_hash" class="form-control"
                            placeholder="{{ __('Transaction hash') }}" required />
                    </div>
                    <div class="form-group">
                        <label>{{ __('Used Gas:') }}</label>
                        <input type="text" name="used_gas" class="form-control" placeholder="{{ __('Used gas') }}"
                            required />
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">{{ __('Close') }}</button>
                    <button class="btn btn-success" type="submit">{{ __('Confirm') }}</button>
                </div>
            </form>
        </div>
    </div>
</div>
