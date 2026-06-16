@extends('admin.master', ['menu' => 'transaction', 'sub_menu' => 'transaction_withdrawal'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-12">
                <ul>
                    <li>{{ __('Transaction History') }} </li>
                    <li class="active-item">{{ __('Withdrawal History') }}</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- /breadcrumb -->

    <!-- User Management -->
    <div class="user-management wallet-transaction-area">
        <div class="row no-gutters">
            <div class="col-12">
                <!-- Inline Tabs -->
                <ul class="nav nav-tabs mb-3" id="inlineTab" role="tablist">
                    <li class="nav-item">
                        <a class="nav-link active" id="pending-withdrawal-tab" data-toggle="tab" href="#pending-withdrawal"
                            role="tab" aria-controls="pending-withdrawal" aria-selected="true">
                            {{ __('Pending Withdrawal List') }}
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" id="failed-withdrawal-tab" data-toggle="tab" href="#failed-withdrawal"
                            role="tab" aria-controls="failed-withdrawal" aria-selected="false">
                            {{ __('Failed Withdrawal List') }}
                        </a>
                    </li>
                </ul>

                <!-- Tab Content -->
                <div class="tab-content" id="inlineTabContent">
                    <!-- Pending Withdrawal Tab -->
                    <div class="tab-pane fade show active" id="pending-withdrawal" role="tabpanel"
                        aria-labelledby="pending-withdrawal-tab">
                        <div class="table-area">
                            <form id="pending_withdrawal_form" class="row"
                                action="{{ route('adminTransactionHistoryExport') }}" method="get">
                                @csrf
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('From Date') }}</label>
                                    <input type="hidden" name="type" value="pending_withdrawal_form" />
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
                                <table id="pending-withdrawal-table" class="table w-100">
                                    <thead>
                                        <tr>
                                            <th>{{ __('Status') }}</th>
                                            <th>{{ __('Type') }}</th>
                                            <th>{{ __('Amount') }}</th>
                                            <th>{{ __('Coin Type') }}</th>
                                            <th>{{ __('Address') }}</th>
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

                    <!-- Failed Withdrawal Tab -->
                    <div class="tab-pane fade" id="failed-withdrawal" role="tabpanel"
                        aria-labelledby="failed-withdrawal-tab">
                        <div class="table-area">
                            <form id="reject_withdrawal_form" class="row"
                                action="{{ route('adminTransactionHistoryExport') }}" method="get">
                                @csrf
                                <div class="col-3 form-group">
                                    <label for="#">{{ __('From Date') }}</label>
                                    <input type="hidden" name="type" value="reject_withdrawal_form" />
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
                                <table id="failed-withdrawal-table" class="table w-100">
                                    <thead>
                                        <tr>
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

    <!-- Modal for Withdrawal Details -->
    <div class="modal fade" id="withdrawalDetailsModal" role="dialog">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ __('Withdrawal Details') }}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <!-- Withdrawal details will be loaded here dynamically -->
                    <div id="withdrawalDetailsContent"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- /Modal for Withdrawal Details -->

    @include('admin.common.accept_pending_withdrawal_html')
    @include('admin.common.make_as_withdrawal_success_html')
    @include('admin.common.reject_html_get_reject_note')
@endsection

@section('script')
    <script>
        (function($) {
            "use strict";

            function initDataTable(tableId, route) {
                $(tableId).DataTable({
                    serverSide: true,
                    responsive: false,
                    pageLength: 25,
                    stateSave: true,
                    ajax: route,
                    language: {
                        paginate: {
                            next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                            previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                        }
                    },
                    order: [7, 'desc'], // order by updated_at
                    columns: [{
                            data: "status",
                            name: 'status'
                        }, {
                            data: "address_type",
                            name: 'address_type'
                        },
                        {
                            data: "amount",
                            name: 'amount'
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
                            data: "transaction_hash",
                            name: 'transaction_hash'
                        },
                        {
                            data: "updated_at",
                            name: 'updated_at'
                        },
                        // {
                        //     data: "actions",
                        //     name: 'actions'
                        // }
                        {
                            data: "actions",
                            name: 'actions',
                            render: function(data, type, row, meta) {
                                return `<div class="activity-icon">
                                    <ul style="gap: 10px">
                                        <li class="deleteuser m-0">
                                            <a title="{{ __('View') }}" href="#" onclick="viewWithdrawalDetails('${ data.id }')" class="text-info" style="font-size: 20px">
                                                <i class="fa fa-eye" aria-hidden="true" ></i>
                                            </a>
                                        </li>
                                        
                                        ${data.status == 0 || data.status == 3 ? `
                                    <li class="deleteuser m-0">
                                        <a title="{{ __('Accept') }}" href="#" onclick="acceptRequest('${ data.id }', '${ data.acceptPendingWithdrawalRoute }', '${ data.status == 3 ? 0 : data.status }', '${ data.status == 3 ? 1 : 0 }')" class="text-success" style="font-size: 20px">
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
            }

            initDataTable('#pending-withdrawal-table', "{{ route('adminPendingWithdrawal') }}");
            initDataTable('#failed-withdrawal-table', "{{ route('adminFailedWithdrawal') }}");
        })(jQuery);

        function viewWithdrawalDetails(item) {
            let url = "{{ route('adminWithdrawalDetails', ['id' => ':id']) }}";
            url = url.replace(':id', item);
            $.ajax({
                url: url,
                method: 'GET',
                data: {
                    id: item
                },
                dataType: 'html',
                success: function(response) {
                    $('#withdrawalDetailsContent').html(response);
                    $('#withdrawalDetailsModal').modal('show');
                },
                error: function(error) {
                    console.error("Error fetching withdrawal details:", error);
                }
            });
        }

        function acceptRequest(id, route, status, alReadyFailed = 0) {
            if (status == 3) { // WithdrawHistory::FAILED
                $('#make_as_withdrawal_success_modal form').attr('action', route);
                $('#make_as_withdrawal_success_modal input[name="id"]').val(id);
                $('#make_as_withdrawal_success_modal').modal('show');
            } else {
                $('#accept_request_modal .action-btn').attr('href', route);
                if(Number(alReadyFailed)) $("#only_for_failed_notice").removeClass("d-none");
                $('#accept_request_modal').modal('show');
            }
        }

        $('#accept_request_modal').on('hidden.bs.modal', function (e) {
            $("#only_for_failed_notice").addClass("d-none");
        })

        function rejectRequest(id, route) {
            $('#reject_request_modal form').attr('action', route);
            $('#reject_request_modal input[name="id"]').val(id);
            $('#reject_request_modal').modal('show');
        }
    </script>
@endsection
