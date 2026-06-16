<div id="accept_request_modal" class="modal fade delete" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">{{ __('Accept Withdrawal') }}</h6>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <div class="modal-body">
                <p>{{ __('Do you want to Accept Withdrawal ?') }}</p>
                <p>
                    <ul id="only_for_failed_notice" class="text-warning m-3 d-none" style="list-style: disc;">
                        <li>{{ __('Sometimes Withdrawals succeed on the Blockchain but the Exchange is not notified about it.') }}</li>
                        <li>{{ __('In such cases, you might see that the Withdrawal request has failed.') }}</li>
                        <li>{{ __('So please, check on the block explorer website with the system wallet address.') }}</li>
                        <li>{{ __('And try to be sure if the Withdrawal has really succeeded or not.') }}</li>
                        <li>{{ __('If you are sure that the Withdrawal has NOT succeeded - ONLY then proceed to accept the Withdrawal request again.') }}</li>
                    </ul>
                </p>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">{{ __('Close') }}</button>
                <a class="btn btn-success action-btn" href="#" onclick="this.classList.add('disabled'); this.onclick = null;">{{ __('Confirm') }}</a>
            </div>
        </div>
    </div>
</div>
