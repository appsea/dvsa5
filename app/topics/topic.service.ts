import { PersistenceService } from "~/services/persistence.service";
import { ISubTopic, ITopic, ITopicStatus } from "~/shared/questions.model";

export class TopicService {

    static getInstance(): TopicService {
        return TopicService._instance;
    }

    private static _instance: TopicService = new TopicService();
    private _topics: Array<ITopic>;

    constructor() {
        this._topics = !PersistenceService.getInstance().hasTopics() ? this.createSubTopics()
            : PersistenceService.getInstance().readTopics();
    }

    saveSubTopic(subTopic: ISubTopic): void {
        const st: ISubTopic = this.findSubTopicFromLink(subTopic.link);
        st.complete = subTopic.complete;
        PersistenceService.getInstance().saveTopics(this._topics);
    }

    findSubTopicFromLink(link: string): ISubTopic {
        const topic: ITopic = this._topics.filter((t) => t.subTopics.filter((sub) => sub.link === link).length > 0)[0];
        const subTopic: ISubTopic = topic.subTopics.filter((sub) => sub.link === link)[0];

        return subTopic;
    }

    getTopicStatus(): Array<ITopicStatus> {
        return this.readTopicStatus();
    }

    readTopicStatus(): Array<ITopicStatus> {
        const status: Array<ITopicStatus> = this._topics.map((t) => {
            const attempted = t.subTopics.filter((s) => s.complete).length;
            const percentage = (attempted * 100 / t.subTopics.length).toFixed(0);

            return {icon: t.icon, name: t.name, attempted, total: t.subTopics.length, percentage};
        });

        return status;
    }

    findSubTopics(topic: string): Array<ISubTopic> {
        return this._topics.filter((t) => t.name === topic)[0].subTopics;
    }

    createSubTopics(): Array<ITopic> {
        const list: Array<ITopic> = [];
        const first: ITopic = {
            icon: String.fromCharCode(0xf29d),
            name: "Vulnerable road users",
            subTopics: this.createSubTopicsForVulnerableRoadUsers()
        };
        const second: ITopic = {
            icon: String.fromCharCode(0xf5e1),
            name: "Incidents",
            subTopics: this.createSubTopicsForIncidents()
        };
        const third: ITopic = {
            icon: String.fromCharCode(0xf3ed),
            name: "Safety and your vehicle",
            subTopics: this.createSubTopicsForSafetyAndYourVehicle()
        };
        const fourth: ITopic = {
            icon: String.fromCharCode(0xf118),
            name: "Attitude",
            subTopics: this.createSubTopicsForAttitude()
        };
        const fifth: ITopic = {
            icon: String.fromCharCode(0xf06e),
            name: "Alertness",
            subTopics: this.createSubTopicsForAlertness()
        };
        const sixth: ITopic = {
            icon: String.fromCharCode(0xf02d),
            name: "Documents",
            subTopics: this.createSubTopicsForDocuments()
        };
        const seventh: ITopic = {
            icon: String.fromCharCode(0xf560),
            name: "Safety margins",
            subTopics: this.createSubTopicsForSafetyMargins()
        };
        const eighth: ITopic = {
            icon: String.fromCharCode(0xf06e),
            name: "Rules of the road",
            subTopics: this.createSubTopicsForRulesOfTheRoad()
        };
        const nineth: ITopic = {
            icon: String.fromCharCode(0xf637),
            name: "Road and traffic sign",
            subTopics: this.createSubTopicsForRoadAndTrafficSign()
        };
        const tenth: ITopic = {
            icon: String.fromCharCode(0xf4df),
            name: "Other types of vehicles",
            subTopics: this.createSubTopicsForOtherTypesOfVehicles()
        };
        const eleventh: ITopic = {
            icon: String.fromCharCode(0xf071),
            name: "Hazard awareness",
            subTopics: this.createSubTopicsForHazzardAwareness()
        };
        const twelveth: ITopic = {
            icon: String.fromCharCode(0xf59d),
            name: "Vehicle loading",
            subTopics: this.createSubTopicsForVehicleLoading()
        };
        const thirteenth: ITopic = {
            icon: String.fromCharCode(0xf1B9),
            name: "Vehicle handling",
            subTopics: this.createSubTopicsForVehicleHandling()
        };
        const fourteenth: ITopic = {
            icon: String.fromCharCode(0xf018),
            name: "Motorway driving",
            subTopics: this.createSubTopicsForMotorwayDriving()
        };
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);
        list.push(eighth);
        list.push(nineth);
        list.push(tenth);
        list.push(eleventh);
        list.push(twelveth);
        list.push(thirteenth);
        list.push(fourteenth);

        return list;
    }

    createSubTopicsForVulnerableRoadUsers(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/vru/introduction-page", complete: false};
        const second: ISubTopic = {name: "Pedestrians", link: "topics/vru/pedestrians-page", complete: false};
        const third: ISubTopic = {name: "Children", link: "topics/vru/children-page", complete: false};
        const fourth: ISubTopic = {
            name: "Older and disabled pedestrians",
            link: "topics/vru/older-page",
            complete: false
        };
        const fifth: ISubTopic = {name: "Cyclists", link: "topics/vru/cyclists-page", complete: false};
        const sixth: ISubTopic = {name: "Motorcyclists", link: "topics/vru/motorcyclists-page", complete: false};
        const seventh: ISubTopic = {name: "Animals", link: "topics/vru/animals-page", complete: false};
        const eighth: ISubTopic = {name: "Other drivers", link: "topics/vru/otherDrivers-page", complete: false};
        const nineth: ISubTopic = {name: "FAQs", link: "topics/vru/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);
        list.push(eighth);
        list.push(nineth);

        return list;
    }

    createSubTopicsForAttitude(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/attitude/introduction-page", complete: false};
        const second: ISubTopic = {name: "Consideration", link: "topics/attitude/consideration-page", complete: false};
        const third: ISubTopic = {name: "Following safely", link: "topics/attitude/following-page", complete: false};
        const fourth: ISubTopic = {name: "Courtesy", link: "topics/attitude/courtesy-page", complete: false};
        const fifth: ISubTopic = {name: "Priority", link: "topics/attitude/priority-page", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/attitude/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);

        return list;
    }

    createSubTopicsForAlertness(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Observation", link: "topics/alertness/observation-page", complete: false};
        const second: ISubTopic = {
            name: "Anticipation and awareness",
            link: "topics/alertness/anticipation-page",
            complete: false
        };
        const third: ISubTopic = {name: "Concentration", link: "topics/alertness/concentration-page", complete: false};
        const fourth: ISubTopic = {
            name: "Distraction and boredom",
            link: "topics/alertness/distraction-page",
            complete: false
        };
        const fifth: ISubTopic = {name: "FAQs", link: "topics/alertness/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);

        return list;
    }

    createSubTopicsForDocuments(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/documents/introduction-page", complete: false};
        const second: ISubTopic = {name: "Licenses", link: "topics/documents/licenses-page", complete: false};
        const third: ISubTopic = {name: "Insurance", link: "topics/documents/insurance-page", complete: false};
        const fourth: ISubTopic = {name: "MOT certificate", link: "topics/documents/mot-page", complete: false};
        const fifth: ISubTopic = {name: "FAQs", link: "topics/documents/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);

        return list;
    }

    createSubTopicsForSafetyMargins(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {
            name: "Introduction",
            link: "topics/safetymargins/introduction-page",
            complete: false
        };
        const second: ISubTopic = {
            name: "Stopping distances",
            link: "topics/safetymargins/stopping-page",
            complete: false
        };
        const third: ISubTopic = {
            name: "Weather conditions",
            link: "topics/safetymargins/weather-page",
            complete: false
        };
        const fourth: ISubTopic = {name: "Skidding", link: "topics/safetymargins/skidding-page", complete: false};
        const fifth: ISubTopic = {
            name: "Contraflow systems",
            link: "topics/safetymargins/contraflow-page",
            complete: false
        };
        const sixth: ISubTopic = {name: "FAQs", link: "topics/safetymargins/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);

        return list;
    }

    createSubTopicsForRulesOfTheRoad(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/rules/introduction-page", complete: false};
        const second: ISubTopic = {name: "Speed limits", link: "topics/rules/speed-page", complete: false};
        const third: ISubTopic = {name: "Lanes and junctions", link: "topics/rules/lanes-page", complete: false};
        const fourth: ISubTopic = {
            name: "Overtaking, turning and reversing",
            link: "topics/rules/overtaking-page",
            complete: false
        };
        const fifth: ISubTopic = {name: "Crossings", link: "topics/rules/crossings-page", complete: false};
        const sixth: ISubTopic = {name: "Level crossings", link: "topics/rules/level-page", complete: false};
        const seventh: ISubTopic = {name: "Stopping and parking", link: "topics/rules/stopping-page", complete: false};
        const eighth: ISubTopic = {name: "Smoking in your car", link: "topics/rules/smoking-page", complete: false};
        const nineth: ISubTopic = {name: "FAQs-page", link: "topics/rules/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);
        list.push(eighth);
        list.push(nineth);

        return list;
    }

    createSubTopicsForRoadAndTrafficSign(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Signs", link: "topics/road/signs-page", complete: false};
        const second: ISubTopic = {name: "Road markings", link: "topics/road/road-page", complete: false};
        const third: ISubTopic = {
            name: "Traffic lights and warning lights", link: "topics/road/traffic",
            complete: false
        };
        const fourth: ISubTopic = {
            name: "Signal given by other drivers",
            link: "topics/road/signalother-page",
            complete: false
        };
        const fifth: ISubTopic = {
            name: "Signal given by police",
            link: "topics/road/signalpolice-page",
            complete: false
        };
        const sixth: ISubTopic = {name: "Use of road lanes", link: "topics/road/use-page", complete: false};
        const seventh: ISubTopic = {name: "FAQs", link: "topics/road/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);

        return list;
    }

    createSubTopicsForOtherTypesOfVehicles(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/other/introduction-page", complete: false};
        const second: ISubTopic = {name: "Motorcycles", link: "topics/other/motorcycles-page", complete: false};
        const third: ISubTopic = {name: "Large vehicles", link: "topics/other/large-page", complete: false};
        const fourth: ISubTopic = {name: "Buses", link: "topics/other/buses-page", complete: false};
        const fifth: ISubTopic = {name: "Trams", link: "topics/other/trams-page", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/other/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);

        return list;
    }

    createSubTopicsForHazzardAwareness(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/hazzard/introduction-page", complete: false};
        const second: ISubTopic = {name: "Static hazards", link: "topics/hazzard/static-page", complete: false};
        const third: ISubTopic = {name: "Moving hazards", link: "topics/hazzard/moving-page", complete: false};
        const fourth: ISubTopic = {name: "Yourself", link: "topics/hazzard/yourself-page", complete: false};
        const fifth: ISubTopic = {
            name: "Road and weather conditions",
            link: "topics/hazzard/road-page",
            complete: false
        };
        const sixth: ISubTopic = {name: "FAQs", link: "topics/hazzard/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);

        return list;
    }

    createSubTopicsForVehicleLoading(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {
            name: "Vehicle stability",
            link: "topics/vehicleLoading/vehicle-page",
            complete: false
        };
        const second: ISubTopic = {name: "Passengers", link: "topics/vehicleLoading/passengers-page", complete: false};
        const third: ISubTopic = {name: "Towing", link: "topics/vehicleLoading/towing-page", complete: false};
        const fourth: ISubTopic = {name: "FAQs", link: "topics/vehicleLoading/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);

        return list;
    }

    createSubTopicsForVehicleHandling(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {
            name: "Introduction",
            link: "topics/vehicleHandling/introduction-page",
            complete: false
        };
        const second: ISubTopic = {
            name: "Weather conditions",
            link: "topics/vehicleHandling/weather-page",
            complete: false
        };
        const third: ISubTopic = {
            name: "Driving at night",
            link: "topics/vehicleHandling/driving-page",
            complete: false
        };
        const fourth: ISubTopic = {
            name: "Control and speed",
            link: "topics/vehicleHandling/control-page",
            complete: false
        };
        const fifth: ISubTopic = {
            name: "Traffic calming and road surface",
            link: "topics/vehicleHandling/traffic-page",
            complete: false
        };
        const sixth: ISubTopic = {
            name: "Motorcyclists",
            link: "topics/vehicleHandling/motorcyclists-page",
            complete: false
        };
        const seventh: ISubTopic = {name: "Animals", link: "topics/vehicleHandling/animals-page", complete: false};
        const eighth: ISubTopic = {name: "Other Drivers", link: "topics/vehicleHandling/other-page", complete: false};
        const nineth: ISubTopic = {name: "FAQs", link: "topics/vehicleHandling/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);
        list.push(eighth);
        list.push(nineth);

        return list;
    }

    createSubTopicsForMotorwayDriving(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/motorway/introduction-page", complete: false};
        const second: ISubTopic = {
            name: "Driving on the motorway",
            link: "topics/motorway/driving-page",
            complete: false
        };
        const third: ISubTopic = {name: "Speed limits", link: "topics/motorway/speed-page", complete: false};
        const fourth: ISubTopic = {name: "Reducing congestion", link: "topics/motorway/reducing-page", complete: false};
        const fifth: ISubTopic = {name: "Lane markings", link: "topics/motorway/lane-page", complete: false};
        const sixth: ISubTopic = {
            name: "Stopping and breakdowns",
            link: "topics/motorway/stopping-page",
            complete: false
        };
        const seventh: ISubTopic = {name: "FAQs", link: "topics/motorway/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);

        return list;
    }

    private createSubTopicsForIncidents(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Breakdowns", link: "topics/incidents/breakdowns-page", complete: false};
        const second: ISubTopic = {name: "Safety in tunnels", link: "topics/incidents/safety-page", complete: false};
        const third: ISubTopic = {
            name: "Warning others of an incident",
            link: "topics/incidents/warning-page",
            complete: false
        };
        const fourth: ISubTopic = {
            name: "Stopping at an incident",
            link: "topics/incidents/stopping-page",
            complete: false
        };
        const fifth: ISubTopic = {name: "First aid", link: "topics/incidents/firstaid-page", complete: false};
        const sixth: ISubTopic = {name: "Reporting", link: "topics/incidents/reporting-page", complete: false};
        const seventh: ISubTopic = {name: "FAQs", link: "topics/incidents/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);

        return list;
    }

    private createSubTopicsForSafetyAndYourVehicle(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Basic maintenance", link: "topics/safety/basic-page", complete: false};
        const second: ISubTopic = {name: "Defects", link: "topics/safety/defects-page", complete: false};
        const third: ISubTopic = {name: "Safety equipment", link: "topics/safety/safety-page", complete: false};
        const fourth: ISubTopic = {name: "Security", link: "topics/safety/security-page", complete: false};
        const fifth: ISubTopic = {
            name: "Considering other road users",
            link: "topics/safety/considering-page",
            complete: false
        };
        const sixth: ISubTopic = {name: "Environment", link: "topics/safety/environment-page", complete: false};
        const seventh: ISubTopic = {name: "Avoiding congestion", link: "topics/safety/avoiding-page", complete: false};
        const eighth: ISubTopic = {name: "FAQs", link: "topics/safety/faqs-page", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);
        list.push(sixth);
        list.push(seventh);
        list.push(eighth);

        return list;
    }
}
