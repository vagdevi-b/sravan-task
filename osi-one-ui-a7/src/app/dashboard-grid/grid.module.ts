export interface Dashboard {
    [x: string]: any;
    [key: number]: Widget[];
}

export interface Widget {
    id?: string;
    client_widget_id?: number;
    seq_num?: number;
    name?: string;
    type?: string;
    status?: boolean;
    service_uri?: string;
    preferences?: Preferences | string;
    is_employee_enabled?: boolean;
    is_visible?: boolean;
    tableHeading?: string;
    imageUrl?: string;
    title?: string;
    widget_setting?: WidgetSettings;
}

export interface WidgetSettings {
    enable_settings: string;
    id: number;
    is_closable: boolean;
    is_maximizable: boolean;
    is_minimizable: boolean;
    is_movable: boolean;
    is_resizable: boolean;

}

export interface CompononentDetails {
    type?: string;
    label1?: string;
    label2?: string;
    serviceUrl?: string;
    action1?: string;
    action2?: string;
    lov?: string;
}

export interface Preferences {
    isCaurosel?: boolean;
    primaryColor?: string;
    fontSize?: string;
    secondaryColor?: string;
    fontFamily?: string;
    backgroundImg?: string;
    header?: CompononentDetails;
    footer?: CompononentDetails;
    data?: Data[];
    dynamicClass?: string;
    imageFlag?: boolean;
    notificationserviceUrl?: string;
    announcementserviceUrl?: string;
    isBackgroundColor?: boolean;
    isBackgroundImage?: boolean;
}

export interface Data {
    uiInput?: string;
    bEKey?: string;
    label?: string;
    header?: string;
    dimensions?: any;
    action?: any;
    format?: string;
}
