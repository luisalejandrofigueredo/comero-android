export interface PatientDocument {
        "id": string,
        "firstName":string,
        "lastName":string,
        "bloodPressureMax": number,
        "bloodPressureMin": number,
        "pulse": number,
        "oxygen":number,
        "_meta": {
            "lwt": number
        },
        "_deleted": boolean,
        "_attachments": {},
        "_rev": string
}
