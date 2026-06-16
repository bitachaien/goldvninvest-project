@extends('admin.master', ['menu' => 'wallet'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-12">
                <ul>
                    <li>{{ __('Wallet Management') }}</li>
                    <li class="active-item">{{ __('User Wallet Address List') }}</li>
                </ul>
            </div>
        </div>
    </div>
    <!-- /breadcrumb -->

    <!-- User Management -->
    <div class="user-management pt-4">
        <div class="row">
            <div class="col-12">
                <div class="table-area">
                    <div class="table-responsive">
                        <table id="table" class="table w-100">
                            <thead>
                                <tr>
                                    <th>{{ __('Coin Type') }}</th>
                                    <th>{{ __('User') }}</th>
                                    <th>{{ __('Address') }}</th>
                                    <th>{{ __('Status') }}</th>
                                    <th>{{ __('Date') }}</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /User Management -->
@endsection

@section('script')
    <script>
        (function($) {
            "use strict";
            $('#table').DataTable({
                responsive: false,
                stateSave: true,
                serverSide: true,
                ajax: "{{ route('walletAddressList') }}",
                order: [4, 'desc'],
                language: {
                    paginate: {
                        next: '<i class="fa fa-angle-double-right" aria-hidden="true"></i>',
                        previous: '<i class="fa fa-angle-double-left" aria-hidden="true"></i>'
                    }
                },
                columns: [{
                        data: "coin_type",
                        name: "coin_type",
                    },
                    {
                        data: "user_email",
                        name: "user_email",
                    },
                    {
                        data: "address",
                        name: "address",
                    },
                    {
                        data: "status",
                        name: "status",
                    },
                    {
                        data: "created_at",
                        name: "created_at",
                    },
                ],
            });
        })(jQuery)
    </script>
@endsection
