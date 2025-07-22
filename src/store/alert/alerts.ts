import useAlertStore, { AlertType } from "./alertStore";

export const showAlert = ({ ...rest }: AlertType) => {
    const { addAlert } = useAlertStore.getState();

    return addAlert({
        ...rest
    })
}