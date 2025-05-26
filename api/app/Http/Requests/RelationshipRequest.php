<?php

namespace App\Http\Requests;

use App\Models\Relationship;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Gate;

final class RelationshipRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $relationship = $this->route('relationship');

        if (!$relationship) {
            return $this->user()->can('create', Relationship::class);
        }

        $method = strtoupper($this->method());
        $action = 'view';

        if ($method === 'PUT' || $method === 'PATCH') {
            $action = 'update';
        } elseif ($method === 'DELETE') {
            $action = 'delete';
        }

        /**
         * @see https://laravel.com/docs/12.x/authorization#policy-responses
         */
        $response = Gate::inspect($action, $relationship);

        if ($response->denied()) {
            throw new AuthorizationException($response->message());
        }

        return $response->allowed();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => 'required|exists:relationship_types,id',
            'name' => 'required|min:3|max:50',
            'title' => 'required|min:3|max:50',
            'health' => 'required|numeric|min:1|max:10',
            'birthday' => 'nullable|date|before:today',
            'description' => 'nullable|string|max:500',
            'images' => 'nullable|array|max:10',
            'images.*' => fn (...$args) => $this->validateImages(...$args),
        ];
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type' => 'The selected relationship type is invalid.',
            'images.max' => 'You may not upload more than 10 images per relationship.',
        ];
    }

    private function validateImages(string $attribute, UploadedFile $value, \Closure $fail): void
    {
        // Check for image mime types
        if (!str_starts_with($value->getMimeType(), 'image')) {
            $fail("The file {$value->getClientOriginalName()} must be a jpg, jpeg, png, bmp, or gif.");
        }

        // Check the max file size
        if ($value->getSize() > 1048576) {
            $fail("The image {$value->getClientOriginalName()} must be less than 1MB.");
        }
    }
}
