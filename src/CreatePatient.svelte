<script lang="ts">
    import { createPatient } from './api';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    // State for the form inputs
    let patient = {
        resourceType: "Patient",
        name: [{
            given: [],
            family: ""
        }],
        gender: "unknown",
        birthDate: ""
    };

    let errors = {
        givenName: "",
        familyName: "",
        birthDate: ""
    };

    function validate() {
        errors.givenName = patient.name[0].given[0] ? "" : "Name is required";
        errors.familyName = patient.name[0].family ? "" : "Last name is required";
        if (!patient.birthDate) {
            errors.birthDate = "Birth date is required";
        } else {
            const today = new Date();
            const birthDate = new Date(patient.birthDate);
            today.setHours(0, 0, 0, 0); // Ignore time part
            if (birthDate > today) {
                errors.birthDate = "Birth date cannot be in the future";
            } else {
                errors.birthDate = "";
            }
        }

        return Object.values(errors).every(error => error === "");
    }

    // Function to handle form submission
    async function handleSubmit() {
        if (!validate()) {
            return;
        }
        try {
            const newPatient = await createPatient(patient);
            console.log("Patient created:", newPatient);
            
            dispatch('patientCreated');

            // Optionally, dispatch an event to notify the parent component
            // For now, we can just clear the form
            patient = {
                resourceType: "Patient",
                name: [{
                    given: [],
                    family: ""
                }],
                gender: "unknown",
                birthDate: ""
            };


        } catch (error) {
            console.error("Error creating patient:", error);
            alert("Failed to create patient. Check the console for more details.");
        }
    }
    function handleCancel() {
        dispatch('cancel');
    }
</script>

<main class="form-container">
    <form on:submit|preventDefault={handleSubmit}>
        <div class="space-y-4">
            <div>
                <label for="givenName" class="block text-sm font-medium text-gray-700">Name</label>
                <input type="text" id="givenName" bind:value={patient.name[0].given[0]} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                {#if errors.givenName}<p class="text-red-500 text-xs mt-1">{errors.givenName}</p>{/if}
            </div>

            <div>
                <label for="familyName" class="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" id="familyName" bind:value={patient.name[0].family} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                {#if errors.familyName}<p class="text-red-500 text-xs mt-1">{errors.familyName}</p>{/if}
            </div>

            <div>
                <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
                <select id="gender" bind:value={patient.gender} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="unknown">Unknown</option>
                </select>
            </div>

            <div>
                <label for="birthDate" class="block text-sm font-medium text-gray-700">Birth Date</label>
                <input type="date" id="birthDate" bind:value={patient.birthDate} class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm">
                {#if errors.birthDate}<p class="text-red-500 text-xs mt-1">{errors.birthDate}</p>{/if}
            </div>
        </div>

        <div class="mt-6">
            <button type="submit" id="create-button" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-400 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                Create
            </button>
            <button id="cancel-button" on:click={handleCancel}>Cancel</button>

        </div>
    </form>
</main>

<style>
    .form-container {
        background-color: #f5f5dc;
        padding: 2rem;
        border-radius: 0.5rem;
        text-align: left;
    }

    #create-button{
        background-color: rgb(174, 216, 174);
        width: 6rem;
        height: 2.5rem;
    }

     #cancel-button {
        background-color: rgb(191, 189, 189);
        width: 6rem;
        height: 2.5rem  
    }

    .p {
        color: red;
        font-size: 0.8em;
    }
    .form-container {
        background-color: #f5f5dc;
        color: #1a1a1a;
    }
</style>
