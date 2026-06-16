<div id="reject_request_modal" class="modal fade delete" role="dialog">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h6 class="modal-title">{{ __('Reject') }}</h6>
                <button type="button" class="close" data-dismiss="modal">&times;</button>
            </div>
            <form action="#" method="post">
                @csrf
                <input type="hidden" name="id" value="" />
                <div class="modal-body">
                    <p>{{ __('Do you want to Reject ?') }}</p>
                    <div class="form-group">
                        <label>{{ __('Reject note:') }}</label>
                        <textarea name="reject_note" class="form-control" placeholder="{{ __('Write reject note') }}" required></textarea>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal">{{ __('Close') }}</button>
                        <button class="btn btn-danger" type="submit">{{ __('Confirm') }}</button>
                    </div>
            </form>
        </div>
    </div>
</div>
