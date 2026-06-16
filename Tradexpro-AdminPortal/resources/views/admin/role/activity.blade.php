@extends('admin.master', ['menu' => 'role', 'sub_menu' => 'admin_login_activity'])
@section('title', $title)

@section('content')
<div class="custom-breadcrumb">
    <div class="row">
        <div class="col-6">
            <ul>
                <li>{{ __('Admin') }}</li>
                <li class="active-item">{{ $title }}</li>
            </ul>
        </div>
    </div>
</div>

<div class="user-management">
    <div class="card">
        <div class="card-body">
            <table id="adminActivityTable" class="table table-bordered table-striped">
            </table>
        </div>
    </div>
</div>


@endsection

@section('script')
<script>
    var table = $('#adminActivityTable').DataTable({
        processing: true,
        serverSide: true,
        stateSave: true,
        columns: [
            { data: 'admin_name', name: 'admin_name', title: 'Admin' },
            { data: 'ip_address', name: 'ip_address', title: 'IP Address' },
            { data: 'device', name: 'device', title: 'Device' },
            { data: 'browser', name: 'browser', title: 'Browser' },
            { data: 'os', name: 'os', title: 'OS' },
            { data: 'user_agent', name: 'user_agent', title: 'User Agent'},
            { data: 'location', name: 'location', title: 'Location' },
            { 
                data: 'login_at',
                name: 'login_at',
                title: 'Login Time',
                render: function (data) {
                    return new Date(data).toLocaleString();
                }
            }
        ],
        order: [[7, 'desc']],
    });
</script>
@endsection

