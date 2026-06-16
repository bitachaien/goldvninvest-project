@php
    $senderInfo = @$transaction->senderWallet->user;
    $receiverInfo = @$transaction->receiverWallet->user;
@endphp
<div>
    @if (@$senderInfo)
        <div class="card text-light">
            <div class="card-body">
                <h5 class="text-light pb-2">
                    Sender Details
                </h5>
                <div class="row">
                    <div class="col-md-12">
                        <strong>User Name:</strong> {{ @$senderInfo->first_name }} {{ @$senderInfo->last_name }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <strong>Email:</strong> {{ @$senderInfo->email }}
                    </div>
                </div>
            </div>
        </div>
    @endif

    @if (@$receiverInfo)
        <div class="card text-light">
            <div class="card-body">
                <h5 class="text-light pb-2">
                    Receiver Details
                </h5>
                <div class="row">
                    <div class="col-md-12">
                        <strong>User Name:</strong> {{ @$receiverInfo->first_name }} {{ @$receiverInfo->last_name }}
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-12">
                        <strong>Email:</strong> {{ @$receiverInfo->email }}
                    </div>
                </div>
            </div>
        </div>
    @endif

    <div class="card text-light">
        <div class="card-body">
            <h5 class="text-light pb-2">
                Transaction Details
            </h5>

            <div class="row">
                <div class="col-md-12">
                    <strong>Date:</strong> {{ $transaction->created_at }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Type:</strong> {{ addressType($transaction->address_type) }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Coin:</strong> {{ $transaction->coin_type }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Network Base Type:</strong> {{ api_settings($transaction->coin->network) }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Network Name:</strong> {{ $networkName }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Address:</strong> {{ $transaction->address }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <u><strong>Total Amount:</strong> {{ $transaction->total }}</u>
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Amount:</strong> {{ $transaction->amount }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Fee:</strong> {{ $transaction->fees }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Used Gas:</strong> {{ $transaction->used_gas }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Transaction Hash:</strong> {{ $transaction->transaction_hash }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Memo:</strong> {{ $transaction->memo }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>User Note:</strong> {{ $transaction->message }}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Status:</strong> {!! withdrawalStatus($transaction->status) !!}
                </div>
            </div>
            <div class="row">
                <div class="col-md-12">
                    <strong>Note:</strong> <em>{{ @$transaction->reject_note ?? '-' }}</em>
                </div>
            </div>
        </div>
    </div>
</div>
