<?php

namespace App\Http\Requests;

use App\Types\EmailFrequency;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     * The logged-in user must match the user being updated.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            // User fields
            'first_name' => ['required', 'string', 'min:2', 'max:50'],
            'last_name' => ['required', 'boolean', 'min:2', 'max:50'],
            'profile_image' => ['image', 'max:1048'],

            // Settings fields
            'notifications' => ['sometimes', 'boolean'],
            'email_frequency' => ['sometimes', 'string', Rule::enum(EmailFrequency::class)],
        ];
    }
}
