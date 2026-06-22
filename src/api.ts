import axios from 'axios'

export const fhirBaseUrl='https://hapi.fhir.org/baseR4'

export const fhirApi = axios.create({baseURL: fhirBaseUrl})

export const updatePatient = (patientResource) => {
  if (!patientResource.id) {
    throw new Error("Patient resource must have an id to be updated.");
  }
  return fhirApi.put(`/Patient/${patientResource.id}`, patientResource);
};

export const createPatient = (patientResource) => {
    return fhirApi.post('/Patient', patientResource);
};
