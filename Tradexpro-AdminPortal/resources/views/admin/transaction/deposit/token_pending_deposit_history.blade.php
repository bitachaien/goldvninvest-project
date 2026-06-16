@extends('admin.master', ['menu' => 'deposit', 'sub_menu' => 'pending_token_deposit'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
<!-- breadcrumb -->
<div class="custom-breadcrumb">
    <div class="row">
        <div class="col-9">
            <ul>
                <li>{{ __('Token Deposit') }}</li>
                <li class="active-item">{{ $title }}</li>
            </ul>
        </div>
    </div>
</div>
<!-- /breadcrumb -->

<!-- User Management -->
<div class="user-management">
    <div class="row">
        <div class="col-12">
            <div class="header-bar">
                <div class="w-100">
                    <div class="p-3 custom-box-shadow">
                        <h5 style="color: #cbcfd7">
                            {{ __('Click the accept icon next to any record to transfer the deposited coin / token from user wallet to System wallet.') }}
                        </h5>
                    </div>
                </div>
            </div>
            <div class="card-body">
                <div class="table-area">
                    <div class="table-responsive">
                        <table id="table" class="table w-100">
                            <thead>
                                <tr>
                                    <th>{{ __('Date') }}</th>
                                    <th>{{ __('Coin') }}</th>
                                    <th>{{ __('Amount') }}</th>
                                    <th>{{ __('From Address') }}</th>
                                    <th>{{ __('To Address') }}</th>
                                    <th>{{ __('Tx Hash') }}</th>
                                    <th>{{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- /User Management -->

@if ($buy_token)
<!-- ICO Token buy history -->
<div class="user-management">
    <div class="row">
        <div class="col-12">
            <div class="header-bar p-4">
                <div class="table-title">
                    <h3>{{ __('Transaction History of Token Buy') }}</h3>

                </div>
            </div>
            <div class="card-body">
                <div class="table-area">
                    <div>
                        <table id="ico-buy-table" class="table w-100">
                            <thead>
                                <tr>
                                    <th>{{ __('Amount') }}</th>
                                    <th>{{ __('Coin') }}</th>
                                    <th>{{ __('From Address') }}</th>
                                    <th>{{ __('To Address') }}</th>
                                    <th>{{ __('Tx Hash') }}</th>
                                    <th>{{ __('Status') }}</th>
                                    <th>{{ __('Created At') }}</th>
                                    <th>{{ __('Actions') }}</th>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<!-- /ICO Token buy history -->
@endif

<div class="modal fade" id="detailsModal" role="dialog">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">Failure Reason</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body">
                <div id="detailsContent"></div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-danger action-btn" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>
@include('admin.common.accept_html')
@endsection

@section('script')
<script>
    (function($) {
        "use strict";

        $('#table').DataTable({
            serverSide: true,
            responsive: false,
            stateSave: true,
            ajax: "{{ route('adminPendingDepositHistory') }}",
            order: [6, 'desc'],
            language: {
                paginate: {
                    next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                    previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                }
            },
            columns: [{
                    "data": "created_at",
                    "orderable": false,
                    render: function(data, type, row, meta) {
                        return `<p style="white-space: nowrap">${data}</span>`
                    }
                }, {
                    "data": "coin_type",
                    "orderable": true
                },
                {
                    "data": "amount",
                    "orderable": true
                },
                {
                    "data": "from_address",
                    "orderable": true
                },
                {
                    "data": "address",
                    "orderable": true
                },
                {
                    "data": "transaction_id",
                    "orderable": false
                },
                {
                    data: "actions",
                    name: 'actions',
                    render: function(data, type, row, meta) {
                        return `<div class="activity-icon">
                                    <ul style="gap: 10px">
                                        <li class="deleteuser m-0">
                                            <a title="Accept" href="#" onclick="acceptRequest('${data.acceptRoute}')" class="text-success" style="font-size: 20px">
                                                <i class="fa fa-check-circle" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        ${data.rejectNote != '' ? `
        <li class="deleteuser m-0">
            <a href="#" data-reject-note="${data.rejectNote}" onclick="detailsRequest(this)" class="text-danger" style="font-size: 20px" >
                <i class="fa fa-info-circle" aria-hidden="true"></i>
            </a>
        </li>
        ` : ''}                                                   
                                    </ul>
                                </div>`;
                    }
                }
            ],
        });

        $('#ico-buy-table').DataTable({
            serverSide: true,
            responsive: false,
            stateSave: true,
            ajax: "{{ route('icoTokenBuyListAccept') }}",
            order: [6, 'desc'],
            language: {
                paginate: {
                    next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                    previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                }
            },
            columns: [{
                    "data": "amount",
                    "orderable": true
                },
                {
                    "data": "coin_type",
                    "orderable": true
                },
                {
                    "data": "from_address",
                    "orderable": true
                },
                {
                    "data": "address",
                    "orderable": true
                },
                {
                    "data": "transaction_id",
                    "orderable": false
                },
                {
                    "data": "status",
                    "orderable": false
                },
                {
                    "data": "created_at",
                    "orderable": true
                },
                {
                    "data": "actions",
                    "orderable": false
                },
            ],
        });

    })(jQuery);

    function acceptRequest(route) {
        $('#accept_request_modal .action-btn').attr('href', route);
        $('#accept_request_modal').modal('show');
    }

    function detailsRequest(element) {
        const text = element.getAttribute('data-reject-note');
        const html = `<p>${text}<p>`;
        $('#detailsContent').html(html);
        $('#detailsModal').modal('show');
    }
</script>
@endsection