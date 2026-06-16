@extends('admin.master',['menu'=>'bank_form', 'sub_menu'=>'admin_bank'])
@section('title', isset($title) ? $title : '')
@section('style')
@endsection
@section('content')
    <!-- breadcrumb -->
    <div class="custom-breadcrumb">
        <div class="row">
            <div class="col-12">
                <ul>
                    <li>{{__('Admin Bank')}}</li>
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
                <div class="profile-info-form">
                    <div class="card-body">
                        <form action="{{route('bank.form.record.save')}}" method="post">
                            @csrf

                            @if(isset($item))
                                <input type="hidden" name="id" value="{{$item->id}}">
                                <input type="hidden" name="form_id" value="{{$item->bank_form->id}}">
                            @endif
                            <input type="hidden" name="access_type" value="{{ \App\Services\BankService\Enums\BankFormAccessType::ADMIN->value }}">
                            <div class="row">
                                @if(!isset($item))
                                    <div class="col-md-6 mt-20">
                                        <label for="country">{{__('Bank Form')}}</label>
                                        <div class="cp-select-area">
                                            <select
                                                class="selectpicker" title="{{ __('Select Bank Form') }}"
                                                id="bank_form"
                                                data-style="dark"
                                                data-live-search="true" data-width="100%"
                                                data-actions-box="true"
                                                @if(isset($item))
                                                    disabled
                                                @else
                                                    name="form_id"
                                                @endif
                                            >
                                            @if(isset($forms))
                                                @foreach($forms as $form)
                                                    @if(isset($item))
                                                        @if($form->id == $item->form_id)
                                                            <option value="{{$form->id}}" selected >{{$form->title}} </option>
                                                        @endif
                                                    @else
                                                        <option value="{{$form->id}}" @if($loop->first) selected @endif >
                                                            {{$form->title}}
                                                        </option>
                                                    @endif
                                                @endforeach
                                            @endif
                                            </select>
                                        </div>
                                    </div>
                                @endif
                            </div>
                            <div class="row" id="field_render">
                                @include('admin.admin-bank.include.field', $fields)
                            </div>
                            <div class="row">
                                <div class="col-md-12">
                                    <button class="button-primary theme-btn">@if(isset($item)) {{__('Update')}} @else {{__('Save')}} @endif</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- /User Management -->

@endsection

@section('script')
<script>
     $(document).ready(()=>{
        @if(old('form_id'))
            $('#bank_form').selectpicker('val', '{{ old('form_id') }}');
        @endif
     })
    $(document).on('change', '#bank_form', function() {
        var id = $(this).val();
        var selected = $(this).find(':selected');

        $.get('{{ route("bank.form.change") }}',{
                _token: '{{ csrf_token() }}',
                id: id
            },
            function(res) {
                if(res.success){
                    $("#field_render").html("");
                    $("#field_render").html(res.data.html);
                } else {
                    VanillaToasts.create({
                        text: res.message,
                        type: 'warning',
                        timeout: 5000
                    });
                }
            }
        );
    });
</script>
@endsection
