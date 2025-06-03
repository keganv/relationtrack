<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Relationships Summary</title>
    <style type="text/css">
        body {
            margin: 0;
            padding: 0;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table {
            border-spacing: 0;
            mso-table-lspace: 0pt;
            mso-table-rspace: 0pt;
        }
        td {
            padding: 0;
        }
        img {
            border: 0;
            -ms-interpolation-mode: bicubic;
        }
        .ReadMsgBody {
            width: 100%;
        }
        .ExternalClass {
            width: 100%;
        }
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
        @media screen and (max-width: 600px) {
            .full-width-table {
                width: 100% !important;
            }
            .inner-table {
                width: 90% !important;
            }
            .header-logo img {
                width: 150px !important; /* Adjust as needed for smaller screens */
                height: auto !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0;">
<center style="width: 100%; background-color: #dddddd;">
    <div style="max-width: 600px; margin: 0 auto; padding-top: 20px;">
        <table class="full-width-table" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff;">
            <tr>
                <td align="center" style="padding:0 0 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="padding: 10px 20px; background-color: #005993;">
                                <a href="{{ env('FRONTEND_URL') }}">
                                    <img src="https://www.relationtrack.com/images/logo-sm.png" alt="RelationTrack" width="200" height="44" style="display: block; border: 0;" />
                                </a>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="padding: 0 20px 20px 20px;">
                    <table class="inner-table" border="0" cellpadding="0" cellspacing="0" width="100%" style="width: 100%;">
                        <tr>
                            <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding-bottom: 15px;">
                                <p style="margin: 0;">Hello {{ $data['user']['first_name'] }}!</p>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding-bottom: 15px;">
                                <h3 style="margin: 0 0 15px;">Your {{ $data['frequency']->label() }} Relationship Summary</h3>
                                <p style="background-color:#eaeaea;margin:0 0 10px;padding:5px;">
                                    Relationships Updated In The Passed {{ $data['frequency']->days() }} Days:
                                </p>
                                <ul style="margin:0 0 5px;padding:0;">
                                    @foreach($data['updated_within'] as $updated)
                                        <li style="list-style:none;padding:10px;border:1px solid #eaeaea;margin:5px 0;">
                                            <p style="margin:0 0 5px;">
                                                {{ $updated['name'] }}
                                                <small>Last updated: {{ $updated['updated_at'] }}</small>
                                            </p>
                                            @if(isset($updated['action_items']))
                                                <div style="background:#b8d9ff;padding:10px;">
                                                    <p style="border-bottom:1px solid #555555;margin:0 0 5px;">Recent Activities:</p>
                                                    @foreach($updated['action_items'] as $actionItem)
                                                        {{ $actionItem['action'] }} (<small>{{ $actionItem['complete'] ? 'completed' : 'incomplete' }}</small>)<br/>
                                                    @endforeach
                                                </div>
                                            @endif
                                        </li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding-bottom: 15px;">
                                <p style="background-color:#eaeaea;margin:0 0 10px;padding:5px;">
                                    Relationships That May Need Your Attention:
                                </p>
                                <ul style="margin:0 0 5px;padding:0;">
                                    @foreach($data['updated_beyond'] as $updated)
                                        <li style="list-style:none;padding:10px;border:1px solid #eaeaea;margin:5px 0;">
                                            <p style="margin:0 0 5px;">{{ $updated['name'] }}</p>
                                            @if(isset($updated['action_items']))
                                                <div style="background:#b8d9ff;padding:10px;">
                                                    <p style="border-bottom:1px solid #555555;margin:0 0 5px;">Recent Activities:</p>
                                                    @foreach($updated['action_items'] as $actionItem)
                                                        {{ $actionItem['action'] }} (<small>{{ $actionItem['complete'] ? 'completed' : 'incomplete' }}</small>)<br/>
                                                    @endforeach
                                                </div>
                                            @endif
                                            <small>Last updated: {{ date('m-d-Y g:i a', strtotime($updated['updated_at'])) }}</small>
                                        </li>
                                    @endforeach
                                </ul>
                            </td>
                        </tr>
                        <tr>
                            <td style="font-family: Arial, sans-serif; font-size: 16px; line-height: 24px; color: #333333; padding-bottom: 15px;">
                                <p style="margin: 0;">Best regards,</p>
                                <p style="margin: 0;">RelationTrack</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td align="center" style="background-color: #eeeeee; padding: 20px 0;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%">
                        <tr>
                            <td align="center" style="font-family: Arial, sans-serif; font-size: 12px; line-height: 18px; color: #666666;">
                                <p style="margin: 0;">
                                    <a href="{{ env('FRONTEND_URL') }}" style="color: #007bff; text-decoration: none;">RelationTrack</a> &nbsp;&bull;&nbsp;
                                    <a href="{{ env('FRONTEND_URL') }}/settings" style="color: #007bff; text-decoration: none;">Update Settings</a> &nbsp;&bull;&nbsp;
                                    <a href="{{ env('FRONTEND_URL') }}/terms" style="color: #007bff; text-decoration: none;">Terms</a>
                                </p>
                                <p style="margin: 10px 0 0 0;">&copy; {{ date('Y') }} RelationTrack.com <br/> All rights reserved</p>
                            </td>
                        </tr>
                    </table>
                </td>
            </tr>
        </table>
    </div>
</center>
</body>
</html>
