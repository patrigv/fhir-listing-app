<script>
    import { fhirApi, updatePatient } from "./api";
    import axios from 'axios';
    import { onMount } from 'svelte';
    import EditPatient from './EditPatient.svelte';

    let patients = [];
    let editingPatientId = null;
    let searchTerm = "";
    let debounceTimer;

    let nextUrl = null;
    let prevUrl = null;
    let total = 0;
    let currentPage = 1;
    const pageSize = 20;

    const fetchPatients = async(url = null, query = null) => {
        try {
            let response;
            if (url) {
                // The URL from the FHIR server for next/prev is absolute, so we don't want to use axios base URL
                response = await axios.get(url);
            } else {
                const params = { _count: pageSize };
                if (query) {
                    params.name = query;
                }
                response = await fhirApi.get('/Patient', { params });
            }
            
            patients = response.data.entry || [];
            total = response.data.total;

            // Extract pagination links
            const links = response.data.link || [];
            nextUrl = links.find(l => l.relation === 'next')?.url || null;
            prevUrl = links.find(l => l.relation === 'previous')?.url || null;

            // Estimate current page
            if (response.data.total) {
                const offsetMatch = url?.match(/_getpagesoffset=(\d+)/);
                if (offsetMatch) {
                    const offset = parseInt(offsetMatch[1], 10);
                    currentPage = Math.floor(offset / pageSize) + 1;
                } else if (!url) {
                    currentPage = 1;
                }
            } else {
                currentPage = 1;
            }

        } catch (error) {
            console.error("Error fetching patients:", error);
            patients = [];
        }
    };

    onMount(async () => {
        await fetchPatients(null, searchTerm);
    });

    $: {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(async () => {
            await fetchPatients(null, searchTerm);
        }, 300);
    }

    function goToNext() {
        if (nextUrl) {
            fetchPatients(nextUrl);
        }
    }

    function goToPrev() {
        if (prevUrl) {
            fetchPatients(prevUrl);
        }
    }

    function handleEdit(patientId) {
        editingPatientId = patientId;
    }

    async function handleSave(event) {
        const updatedPatient = event.detail;
        try {
            await updatePatient(updatedPatient.resource);
            
            const index = patients.findIndex(p => p.resource.id === updatedPatient.resource.id);
            if (index !== -1) {
                patients[index] = updatedPatient;
                patients = [...patients]; // Trigger reactivity
            }
            
            editingPatientId = null; // Exit edit mode
        } catch (error) {
            console.error("Failed to update patient:", error);
            // Optionally, show an error message to the user
        }
    }

    function handleCancel() {
        editingPatientId = null; // Exit edit mode
    }
</script>

<div class="search-container">
    <input type="text" placeholder="Search by name..." bind:value={searchTerm} class="rounded-search-bar" />
</div>

{#if patients.length > 0}
    <table>
        <thead>
            <tr id="header-table">
                <th>Patient identifier</th>
                <th>Name</th>
                <th>Last name</th>
                <th>Gender</th>
                <th>Birth date</th>
                <th>Phone</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {#each patients as patient (patient.resource.id)}
                {#if editingPatientId === patient.resource.id}
                    <EditPatient 
                        {patient} 
                        on:save={handleSave} 
                        on:cancel={handleCancel} 
                    />
                {:else}
                    <tr>
                        <td>{patient.resource.id}</td>
                        <td>{patient.resource.name?.[0]?.given?.[0] || ''}</td>
                        <td>{patient.resource.name?.[0]?.family || ''}</td>
                        <td>{patient.resource.gender || ''}</td>
                        <td>{patient.resource.birthDate || ''}</td>
                        <td>{patient.resource.telecom?.[0]?.value || ''}</td>
                        <td>
                            <button id="edit-button" on:click={() => handleEdit(patient.resource.id)}>
                                <img src="public/images/edit.png" alt="Edit" height="20" width="20">
                                Edit
                            </button>
                        </td>
                    </tr>
                {/if}
            {/each}
        </tbody>
    </table>

    <div class="pagination-container">
        <button on:click={goToPrev} disabled={!prevUrl}>Previous</button>
        <span>Page {currentPage} of {Math.ceil(total / pageSize)}</span>
        <button on:click={goToNext} disabled={!nextUrl}>Next</button>
    </div>
{:else}
    <p>No patients found.</p>
{/if}

<style>
  .search-container {
    margin-bottom: 1rem;
  }
  .rounded-search-bar {
    width: 100%;
    padding: 0.5rem 1rem;
    border-radius: 9999px; /* a large value to make it fully rounded */
    border: 1px solid #ccc;
  }
  tr#header-table {
    background-color: rgb(248, 241, 232);
  }
  table {
    background-color: #f4f4f9;
    margin-top: 2rem;
    width: 100%;
  }
  #edit-button {
    background-color: rgb(142, 182, 183);
    width: 6rem;
    height: 2.5rem;
  }
  .pagination-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
  tr#header-table {
  background-color: rgb(248, 241, 232);
  color: #2d5f5f;
    }

 tbody tr {
  background-color: #eef5f5;
  color: #1a1a1a;
 }
</style>