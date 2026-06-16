<ul class="d-flex activity-menu">
    <li class="viewuser">
        <a onclick="coinPairEditModal({{ $item->id }})"
            title="{{ __('Edit') }}" class="btn btn-primary btn-sm">
            <i class="fa fa-pencil"></i>
        </a>
    </li>
    <li class="viewuser">
        <a href="#delete1WV4d6uF6Ytu18v1Pl_{{ $item->id }}"
            data-toggle="modal" title="{{ __('Delete') }}"
            class="btn btn-danger btn-sm">
            <i class="fa fa-trash"></i>
        </a>
        <div id="delete1WV4d6uF6Ytu18v1Pl_{{ $item->id }}"
            class="modal fade delete" role="dialog">
            <div class="modal-dialog modal-sm">
                <div class="modal-content">
                    <div class="modal-header">
                        <h6 class="modal-title">{{ __('Delete') }}</h6>
                        <button type="button" class="close"
                            data-dismiss="modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <p>{{ __('Do you want to delete ?') }}</p>
                    </div>
                    <div class="modal-footer"><button type="button"
                            class="btn btn-default"
                            data-dismiss="modal">{{ __('Close') }}</button>
                        <a
                            class="btn btn-danger"href="{{ route('coinPairsDelete', encrypt($item->id)) }}">{{ __('Confirm') }}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </li>
    @if ($item->is_chart_updated == STATUS_PENDING)
        <li class="viewuser">
            <a href="#chart1WV4d6uF6Ytu18v1Pl_{{ $item->id }}"
                data-toggle="modal" title="{{ __('Update Chart Data') }}"
                class="btn btn-success btn-sm">
                <i class="fa fa-bar-chart"></i>
            </a>
            <div id="chart1WV4d6uF6Ytu18v1Pl_{{ $item->id }}"
                class="modal fade delete" role="dialog">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h6 class="modal-title">
                                {{ __('Update Chart Data') }}</h6><button
                                type="button" class="close"
                                data-dismiss="modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <p>{{ __('Do you want to get chart data from api ?') }}
                            </p>
                        </div>
                        <div class="modal-footer"><button type="button"
                                class="btn btn-default"
                                data-dismiss="modal">{{ __('Close') }}</button>
                            <a
                                class="btn btn-danger"href="{{ route('coinPairsChartUpdate', encrypt($item->id)) }}">{{ __('Confirm') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </li>
    @endif
    <li class="viewuser">
        <a href="{{ route('coinPairFutureSetting', encrypt($item->id)) }}"
            title="{{ __('Settings') }}" class="btn btn-warning btn-sm">
            <i class="fa fa-cog"></i>
        </a>
    </li>
</ul>

