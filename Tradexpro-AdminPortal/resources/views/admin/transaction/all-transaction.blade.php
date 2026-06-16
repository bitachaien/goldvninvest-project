@extends('admin.master', ['menu' => 'transaction', 'sub_menu' => 'transaction_all'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-12">
                <ul>
                    <li>{{ __('Transaction') }}</li>
                    <li class="active-item">{{ __('All History') }}</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- /breadcrumb -->

    <!-- User Management -->
    <div class="user-management pt-4">
        <div class="row no-gutters">
            <div class="col-12">
                <!-- Inline Tabs -->
                <ul class="nav nav-tabs mb-3" id="inlineTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link {{ @$tab == 'deposit' ? 'active' : '' }}" id="deposit-tab" data-toggle="tab"
                            href="#deposit" role="tab" aria-controls="deposit" aria-selected="true">
                            <img src="{{ asset('assets/admin/images/sidebar-icons/wallet.svg') }}" class="img-fluid"
                                alt="">
                            <span>{{ __('Deposit History') }}</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link {{ @$tab == 'withdraw' ? 'active' : '' }}" id="withdraw-tab" data-toggle="tab"
                            href="#withdraw" role="tab" aria-controls="withdraw" aria-selected="false">
                            <img src="{{ asset('assets/admin/images/sidebar-icons/coin.svg') }}" class="img-fluid"
                                alt="">
                            <span>{{ __('Withdrawal History') }}</span>
                        </a>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="inlineTabContent">
                    <!-- Deposit Tab -->
                    <div class="tab-pane fade {{ @$tab == 'deposit' ? 'show active' : '' }}" id="deposit" role="tabpanel"
                        aria-labelledby="deposit-tab">
                        <div class="table-area">
                            <form id="deposit_form" class="row" action="{{ route('adminTransactionHistoryExport') }}"
                                method="get">
                                @csrf
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('From Date') }}</label>
                                    <input type="hidden" name="type" value="deposit" />
                                    <input type="date" name="from_date" class="form-control" />
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('To Date') }}</label>
                                    <input type="date" name="to_date" class="form-control" />
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('Export') }}</label>
                                    <select name="export_to" class="selectpicker" data-width="100%"
                                        data-style="form-control" title="{{ __('Select a file type') }}">
                                        <option value=".csv">CSV</option>
                                        <option value=".xlsx">XLSX</option>
                                    </select>
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">&nbsp;</label>
                                    <input class="form-control btn btn-primary" style="background-color:#1d2124"
                                        type="submit" value="{{ __('Export') }}" />
                                </div>
                            </form>
                            <div class="table-responsive">
                                <table id="deposit_table" class="table table-borderless custom-table display text-left"
                                    width="100%">
                                    <thead>
                                        <tr>
                                            <th>{{ __('id') }}</th>
                                            <th>{{ __('Status') }}</th>
                                            <th>{{ __('Type') }}</th>
                                            <th>{{ __('Coin Type') }}</th>
                                            <th>{{ __('Address') }}</th>
                                            <th>{{ __('Amount') }}</th>
                                            <th>{{ __('Transaction Id') }}</th>
                                            <th>{{ __('Update Date') }}</th>
                                            <th>{{ __('Actions') }}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Withdraw Tab -->
                    <div class="tab-pane fade {{ @$tab == 'withdraw' ? 'show active' : '' }}" id="withdraw"
                        role="tabpanel" aria-labelledby="withdraw-tab">
                        <div class="table-area">
                            <form id="active_withdrawal_form" class="row"
                                action="{{ route('adminTransactionHistoryExport') }}" method="get">
                                @csrf
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('From Date') }}</label>
                                    <input type="hidden" name="type" value="active_withdrawal_form" />
                                    <input type="date" name="from_date" class="form-control" />
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('To Date') }}</label>
                                    <input type="date" name="to_date" class="form-control" />
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('Export') }}</label>
                                    <select name="export_to" class="selectpicker" data-style="form-control"
                                        data-width="100%" title="{{ __('Select a file type') }}">
                                        <option value=".csv">CSV</option>
                                        <option value=".xlsx">XLSX</option>
                                    </select>
                                </div>
                                <div class="col-3 form-group">
                                    <label for="#">&nbsp;</label>
                                    <input class="form-control btn btn-primary" style="background-color:#1d2124"
                                        type="submit" value="{{ __('Export') }}" />
                                </div>
                            </form>
                            <div class="table-responsive">
                                <table id="withdrawal_table" class="table table-borderless custom-table display text-left"
                                    width="100%">
                                    <thead>
                                        <tr>
                                            <th>{{ __('id') }}</th>
                                            <th>{{ __('Status') }}</th>
                                            <th>{{ __('Type') }}</th>
                                            <th>{{ __('Coin Type') }}</th>
                                            <th>{{ __('Address') }}</th>
                                            <th>{{ __('Amount') }}</th>
                                            <th>{{ __('Transaction Id') }}</th>
                                            <th>{{ __('Update Date') }}</th>
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
    </div>


    <div class="modal fade" id="walletDetailsModal" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title"></h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div id="walletDetailsContent"></div>
                </div>
            </div>
        </div>
    </div>

    @include('admin.common.accept_html')
    @include('admin.common.make_as_withdrawal_success_html')
    @include('admin.common.reject_html_get_reject_note')
    <!-- /User Management -->
@endsection

@section('script')
    <script>
        (function($) {
            "use strict";

            $('#deposit_table').DataTable({
                serverSide: true,
                pageLength: 25,
                stateSave: true,
                responsive: false,
                ajax: "{{ route('adminDepositHistory') }}",
                language: {
                    paginate: {
                        next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                        previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                    }
                },
                order: [0, 'desc'], // order by updated_at
                columns: [{
                        data: "id",
                        name: 'id',
                        visible: false
                    }, {
                        data: "status",
                        name: 'status'
                    }, {
                        data: "address_type",
                        name: 'address_type'
                    },
                    {
                        data: "coin_type",
                        name: 'coin_type'
                    },
                    {
                        data: "address",
                        name: 'address'
                    },
                    {
                        data: "amount",
                        name: 'amount'
                    },
                    {
                        data: "transaction_id",
                        name: 'transaction_id'
                    },
                    {
                        data: "updated_at",
                        name: 'updated_at'
                    },
                    {
                        data: "actions",
                        name: 'actions',
                        render: function(data, type, row, meta) {
                            return `<div class="activity-icon">
                                    <ul style="gap: 10px">
                                        <li class="deleteuser m-0">
                                            <a title="{{ __('View') }}" href="#" onclick="viewWalletDetails('deposit', '${data.id}')" class="text-info" style="font-size: 20px">
                                                <i class="fa fa-eye" aria-hidden="true" ></i>
                                            </a>
                                        </li>
                                    </ul>
                                </div>`;
                        }
                    }
                ]
            });

            $('#withdrawal_table').DataTable({
                serverSide: true,
                pageLength: 25,
                stateSave: true,
                responsive: false,
                ajax: "{{ route('adminWithdrawalHistory') }}",
                language: {
                    paginate: {
                        next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                        previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                    }
                },
                order: [0, 'desc'], // order by updated_at
                columns: [{
                        data: "id",
                        name: 'id',
                        visible: false
                    }, {
                        data: "status",
                        name: 'status'
                    }, {
                        data: "address_type",
                        name: 'address_type'
                    },
                    {
                        data: "coin_type",
                        name: 'coin_type'
                    },
                    {
                        data: "address",
                        name: 'address'
                    },
                    {
                        data: "amount",
                        name: 'amount'
                    },
                    {
                        data: "transaction_hash",
                        name: 'transaction_hash'
                    },
                    {
                        data: "updated_at",
                        name: 'updated_at'
                    },
                    {
                        data: "actions",
                        name: 'actions',
                        render: function(data, type, row, meta) {
                            return `<div class="activity-icon">
                                    <ul style="gap: 10px">
                                        <li class="deleteuser m-0">
                                            <a title="{{ __('View') }}" href="#" onclick="viewWalletDetails('withdrawal', '${data.id}')" class="text-info" style="font-size: 20px">
                                                <i class="fa fa-eye" aria-hidden="true" ></i>
                                            </a>
                                        </li>
                                        ${data.status == 0 || data.status == 3 ? `
                                        <li class="deleteuser m-0">
                                            <a title="{{ __('Accept') }}" href="#" onclick="acceptRequest('${ data.id }', '${ data.acceptPendingWithdrawalRoute }', '${ data.status == 3 ? 0 : data.status }')" class="text-success" style="font-size: 20px">
                                                <i class="fa fa-check-circle" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        ${data.status == 3 ? `
                                            <li class="deleteuser m-0">
                                                <a title="{{ __('Mark Accept') }}" href="#" onclick="acceptRequest('${ data.id }', '${ data.asAcceptPendingWithdrawalRoute }', '${ data.status }')" class="text-success" style="font-size: 20px">
                                                    <i class="fa fa-check-square-o" aria-hidden="true"></i>
                                                </a>
                                            </li>
                                        ` : ''}
                                        <li class="deleteuser m-0">
                                            <a title="{{ __('Reject') }}" href="#" onclick="rejectRequest('${ data.id }', '${ data.rejectPendingWithdrawalRoute }')" class="text-danger" style="font-size: 20px">
                                                <i class="fa fa-times-circle" aria-hidden="true"></i>
                                            </a>
                                        </li>
                                        ` : ''}
                                    </ul>
                                </div>`;
                        }
                    }
                ]
            });
        })(jQuery)

        function viewWalletDetails(type, item) {
            let url = '';
            if (type == 'deposit') {
                url = "{{ route('adminDepositDetails', ['id' => ':id']) }}";
            } else {
                url = "{{ route('adminWithdrawalDetails', ['id' => ':id']) }}";
            }
            url = url.replace(':id', item);

            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    id: item
                },
                dataType: 'html',
                success: function(response) {
                    $('#walletDetailsContent').html(response);
                    $('#walletDetailsModal').modal('show');
                    $('.modal-title').text(type == 'deposit' ? 'Deposit Details' : 'Withdrawal Details');
                },
                error: function(error) {
                    console.error("Error fetching details:", error);
                }
            });
        }

        function acceptRequest(id, route, status) {
            if (status == 3) {
                $('#make_as_withdrawal_success_modal form').attr('action', route);
                $('#make_as_withdrawal_success_modal input[name="id"]').val(id);
                $('#make_as_withdrawal_success_modal').modal('show');
            } else {
                $('#accept_request_modal .action-btn').attr('href', route);
                $('#accept_request_modal').modal('show');
            }
        }

        function rejectRequest(id, route) {
            $('#reject_request_modal form').attr('action', route);
            $('#reject_request_modal input[name="id"]').val(id);
            $('#reject_request_modal').modal('show');
        }
    </script>
@endsection
