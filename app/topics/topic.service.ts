import { PersistenceService } from "~/services/persistence.service";
import { ISubTopic } from "~/shared/questions.model";

export class TopicService {

    static getInstance(): TopicService {
        return TopicService._instance;
    }

    private static _instance: TopicService = new TopicService();
    private _topics: Array<Topic>;

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
        const topic: Topic = this._topics.filter((t) => t.subTopics.filter((sub) => sub.link === link).length > 0)[0];
        const subTopic: ISubTopic = topic.subTopics.filter((sub) => sub.link === link)[0];

        return subTopic;
    }

    getTopicStatus(): Array<TopicStatus> {
        return this.readTopicStatus();
    }

    readTopicStatus(): Array<TopicStatus> {
        const status: Array<TopicStatus> = this._topics.map((t) => {
            const attempted = t.subTopics.filter((s) => s.complete).length;
            const percentage = (attempted * 100 / t.subTopics.length).toFixed(0);

            return {name: t.name, attempted, total: t.subTopics.length, percentage};
        });

        return status;
    }

    findSubTopics(topic: string): Array<ISubTopic> {
        return this._topics.filter((t) => t.name === topic)[0].subTopics;
    }

    /*public createDefaultList(): Array<TopicStatus> {
        let list: Array<TopicStatus> = [];
        let first: TopicStatus = {
            name: "Vulnerable road users",
            attempted: 0,
            total: 9,
            percentage: "60.00%"
        };
        let second: TopicStatus = {
            name: "Incidents",
            attempted: 0,
            total: 7,
            percentage: "60.00%"
        };
        let third: TopicStatus = {
            name: "Safety and your vehicle",
            attempted: 0,
            total: 8,
            percentage: "60.00%"
        };
        let fourth: TopicStatus = {
            name: "Attitude",
            attempted: 0,
            total: 6,
            percentage: "60.00%"
        };
        let fifth: TopicStatus = {
            name: "Alertness",
            attempted: 0,
            total: 5,
            percentage: "60.00%"
        };
        let sixth: TopicStatus = {
            name: "Documents",
            attempted: 0,
            total: 5,
            percentage: "60.00%"
        };
        let seventh: TopicStatus = {
            name: "Safety margins",
            attempted: 0,
            total: 6,
            percentage: "60.00%"
        };
        let eighth: TopicStatus = {
            name: "Rules of the road",
            attempted: 0,
            total: 9,
            percentage: "60.00%"
        };
        let nineth: TopicStatus = {
            name: "Road and traffic sign",
            attempted: 0,
            total: 7,
            percentage: "60.00%"
        };
        let tenth: TopicStatus = {
            name: "Other types of vehicles",
            attempted: 0,
            total: 6,
            percentage: "60.00%"
        };
        let eleventh: TopicStatus = {
            name: "Hazard awareness",
            attempted: 0,
            total: 6,
            percentage: "60.00%"
        };
        let twelveth: TopicStatus = {
            name: "Vehicle loading",
            attempted: 0,
            total: 4,
            percentage: "60.00%"
        };
        let thirteenth: TopicStatus = {
            name: "Vehicle handling",
            attempted: 0,
            total: 7,
            percentage: "60.00%"
        };
        let fourteenth: TopicStatus = {
            name: "Motorway driving",
            attempted: 0,
            total: 6,
            percentage: "60.00%"
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
    }*/

    createSubTopics(): Array<Topic> {
        const list: Array<Topic> = [];
        const first: Topic = {
            name: "Vulnerable road users",
            subTopics: this.createSubTopicsForVulnerableRoadUsers()
        };
        const second: Topic = {
            name: "Incidents",
            subTopics: this.createSubTopicsForIncidents()
        };
        const third: Topic = {
            name: "Safety and your vehicle",
            subTopics: this.createSubTopicsForSafetyAndYourVehicle()
        };
        const fourth: Topic = {
            name: "Attitude",
            subTopics: this.createSubTopicsForAttitude()
        };
        const fifth: Topic = {
            name: "Alertness",
            subTopics: this.createSubTopicsForAlertness()
        };
        const sixth: Topic = {
            name: "Documents",
            subTopics: this.createSubTopicsForDocuments()
        };
        const seventh: Topic = {
            name: "Safety margins",
            subTopics: this.createSubTopicsForSafetyMargins()
        };
        const eighth: Topic = {
            name: "Rules of the road",
            subTopics: this.createSubTopicsForRulesOfTheRoad()
        };
        const nineth: Topic = {
            name: "Road and traffic sign",
            subTopics: this.createSubTopicsForRoadAndTrafficSign()
        };
        const tenth: Topic = {
            name: "Other types of vehicles",
            subTopics: this.createSubTopicsForOtherTypesOfVehicles()
        };
        const eleventh: Topic = {
            name: "Hazard awareness",
            subTopics: this.createSubTopicsForHazzardAwareness()
        };
        const twelveth: Topic = {
            name: "Vehicle loading",
            subTopics: this.createSubTopicsForVehicleLoading()
        };
        const thirteenth: Topic = {
            name: "Vehicle handling",
            subTopics: this.createSubTopicsForVehicleHandling()
        };
        const fourteenth: Topic = {
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
        const first: ISubTopic = {name: "Introduction", link: "topics/vru/introduction", complete: false};
        const second: ISubTopic = {name: "Pedestrians", link: "topics/vru/pedestrians", complete: false};
        const third: ISubTopic = {name: "Children", link: "topics/vru/children", complete: false};
        const fourth: ISubTopic = {name: "Older and disabled pedestrians", link: "topics/vru/older", complete: false};
        const fifth: ISubTopic = {name: "Cyclists", link: "topics/vru/cyclists", complete: false};
        const sixth: ISubTopic = {name: "Motorcyclists", link: "topics/vru/motorcyclists", complete: false};
        const seventh: ISubTopic = {name: "Animals", link: "topics/vru/animals", complete: false};
        const eighth: ISubTopic = {name: "Other drivers", link: "topics/vru/otherDrivers", complete: false};
        const nineth: ISubTopic = {name: "FAQs", link: "topics/vru/faqs", complete: false};
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
        const first: ISubTopic = {name: "Introduction", link: "topics/attitude/introduction", complete: false};
        const second: ISubTopic = {name: "Consideration", link: "topics/attitude/consideration", complete: false};
        const third: ISubTopic = {name: "Following safely", link: "topics/attitude/following", complete: false};
        const fourth: ISubTopic = {name: "Courtesy", link: "topics/attitude/courtesy", complete: false};
        const fifth: ISubTopic = {name: "Priority", link: "topics/attitude/priority", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/attitude/faqs", complete: false};
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
        const first: ISubTopic = {name: "Observation", link: "topics/alertness/observation", complete: false};
        const second: ISubTopic = {
            name: "Anticipation and awareness",
            link: "topics/alertness/anticipation",
            complete: false
        };
        const third: ISubTopic = {name: "Concentration", link: "topics/alertness/concentration", complete: false};
        const fourth: ISubTopic = {name: "Distraction and boredom", link: "topics/alertness/distraction",
                                   complete: false};
        const fifth: ISubTopic = {name: "FAQs", link: "topics/alertness/faqs", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);

        return list;
    }

    createSubTopicsForDocuments(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/documents/introduction", complete: false};
        const second: ISubTopic = {name: "Licenses", link: "topics/documents/licenses", complete: false};
        const third: ISubTopic = {name: "Insurance", link: "topics/documents/insurance", complete: false};
        const fourth: ISubTopic = {name: "MOT certificate", link: "topics/documents/mot", complete: false};
        const fifth: ISubTopic = {name: "FAQs", link: "topics/documents/faqs", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);
        list.push(fifth);

        return list;
    }

    createSubTopicsForSafetyMargins(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/safetymargins/introduction", complete: false};
        const second: ISubTopic = {name: "Stopping distances", link: "topics/safetymargins/stopping", complete: false};
        const third: ISubTopic = {name: "Weather conditions", link: "topics/safetymargins/weather", complete: false};
        const fourth: ISubTopic = {name: "Skidding", link: "topics/safetymargins/skidding", complete: false};
        const fifth: ISubTopic = {name: "Contraflow systems", link: "topics/safetymargins/contraflow", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/safetymargins/faqs", complete: false};
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
        const first: ISubTopic = {name: "Introduction", link: "topics/rules/introduction", complete: false};
        const second: ISubTopic = {name: "Speed limits", link: "topics/rules/speed", complete: false};
        const third: ISubTopic = {name: "Lanes and junctions", link: "topics/rules/lanes", complete: false};
        const fourth: ISubTopic = {
            name: "Overtaking, turning and reversing",
            link: "topics/rules/overtaking",
            complete: false
        };
        const fifth: ISubTopic = {name: "Crossings", link: "topics/rules/crossings", complete: false};
        const sixth: ISubTopic = {name: "Level crossings", link: "topics/rules/level", complete: false};
        const seventh: ISubTopic = {name: "Stopping and parking", link: "topics/rules/stopping", complete: false};
        const eighth: ISubTopic = {name: "Smoking in your car", link: "topics/rules/smoking", complete: false};
        const nineth: ISubTopic = {name: "FAQs", complete: false};
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
        const first: ISubTopic = {name: "Signs", link: "topics/road/signs", complete: false};
        const second: ISubTopic = {name: "Road markings", link: "topics/road/road", complete: false};
        const third: ISubTopic = {name: "Traffic lights and warning lights", link: "topics/road/traffic",
                                  complete: false};
        const fourth: ISubTopic = {
            name: "Signal given by other drivers",
            link: "topics/road/signalother",
            complete: false
        };
        const fifth: ISubTopic = {name: "Signal given by police", link: "topics/road/signalpolice", complete: false};
        const sixth: ISubTopic = {name: "Use of road lanes", link: "topics/road/use", complete: false};
        const seventh: ISubTopic = {name: "FAQs", link: "topics/road/faqs", complete: false};
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
        const first: ISubTopic = {name: "Introduction", link: "topics/other/introduction", complete: false};
        const second: ISubTopic = {name: "Motorcycles", link: "topics/other/motorcycles", complete: false};
        const third: ISubTopic = {name: "Large vehicles", link: "topics/other/large", complete: false};
        const fourth: ISubTopic = {name: "Buses", link: "topics/other/buses", complete: false};
        const fifth: ISubTopic = {name: "Trams", link: "topics/other/trams", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/other/faqs", complete: false};
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
        const first: ISubTopic = {name: "Introduction", link: "topics/hazzard/introduction", complete: false};
        const second: ISubTopic = {name: "Static hazards", link: "topics/hazzard/static", complete: false};
        const third: ISubTopic = {name: "Moving hazards", link: "topics/hazzard/moving", complete: false};
        const fourth: ISubTopic = {name: "Yourself", link: "topics/hazzard/yourself", complete: false};
        const fifth: ISubTopic = {name: "Road and weather conditions", link: "topics/hazzard/road", complete: false};
        const sixth: ISubTopic = {name: "FAQs", link: "topics/hazzard/faqs", complete: false};
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
        const first: ISubTopic = {name: "Vehicle stability", link: "topics/vehicleLoading/vehicle", complete: false};
        const second: ISubTopic = {name: "Passengers", link: "topics/vehicleLoading/passengers", complete: false};
        const third: ISubTopic = {name: "Towing", link: "topics/vehicleLoading/towing", complete: false};
        const fourth: ISubTopic = {name: "FAQs", link: "topics/vehicleLoading/faqs", complete: false};
        list.push(first);
        list.push(second);
        list.push(third);
        list.push(fourth);

        return list;
    }

    createSubTopicsForVehicleHandling(): Array<ISubTopic> {
        const list: Array<ISubTopic> = [];
        const first: ISubTopic = {name: "Introduction", link: "topics/vehicleHandling/introduction", complete: false};
        const second: ISubTopic = {name: "Weather conditions", link: "topics/vehicleHandling/weather", complete: false};
        const third: ISubTopic = {name: "Driving at night", link: "topics/vehicleHandling/driving", complete: false};
        const fourth: ISubTopic = {name: "Control and speed", link: "topics/vehicleHandling/control", complete: false};
        const fifth: ISubTopic = {
            name: "Traffic calming and road surface",
            link: "topics/vehicleHandling/traffic",
            complete: false
        };
        const sixth: ISubTopic = {name: "Motorcyclists", link: "topics/vehicleHandling/motorcyclists", complete: false};
        const seventh: ISubTopic = {name: "Animals", link: "topics/vehicleHandling/animals", complete: false};
        const eighth: ISubTopic = {name: "Other Drivers", link: "topics/vehicleHandling/other", complete: false};
        const nineth: ISubTopic = {name: "FAQs", link: "topics/vehicleHandling/faqs", complete: false};
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
        const first: ISubTopic = {name: "Introduction", link: "topics/motorway/introduction", complete: false};
        const second: ISubTopic = {name: "Driving on the motorway", link: "topics/motorway/driving", complete: false};
        const third: ISubTopic = {name: "Speed limits", link: "topics/motorway/speed", complete: false};
        const fourth: ISubTopic = {name: "Reducing congestion", link: "topics/motorway/reducing", complete: false};
        const fifth: ISubTopic = {name: "Lane markings", link: "topics/motorway/lane", complete: false};
        const sixth: ISubTopic = {name: "Stopping and breakdowns", link: "topics/motorway/stopping", complete: false};
        const seventh: ISubTopic = {name: "FAQs", link: "topics/motorway/faqs", complete: false};
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
        const first: ISubTopic = {name: "Breakdowns", link: "topics/incidents/breakdowns", complete: false};
        const second: ISubTopic = {name: "Safety in tunnels", link: "topics/incidents/safety", complete: false};
        const third: ISubTopic = {
            name: "Warning others of an incident",
            link: "topics/incidents/warning",
            complete: false
        };
        const fourth: ISubTopic = {name: "Stopping at an incident", link: "topics/incidents/stopping", complete: false};
        const fifth: ISubTopic = {name: "First aid", link: "topics/incidents/firstaid", complete: false};
        const sixth: ISubTopic = {name: "Reporting", link: "topics/incidents/reporting", complete: false};
        const seventh: ISubTopic = {name: "FAQs", link: "topics/incidents/faqs", complete: false};
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
        const first: ISubTopic = {name: "Basic maintenance", link: "topics/safety/basic", complete: false};
        const second: ISubTopic = {name: "Defects", link: "topics/safety/defects", complete: false};
        const third: ISubTopic = {name: "Safety equipment", link: "topics/safety/safety", complete: false};
        const fourth: ISubTopic = {name: "Security", link: "topics/safety/security", complete: false};
        const fifth: ISubTopic = {
            name: "Considering other road users",
            link: "topics/safety/considering",
            complete: false
        };
        const sixth: ISubTopic = {name: "Environment", link: "topics/safety/environment", complete: false};
        const seventh: ISubTopic = {name: "Avoiding congestion", link: "topics/safety/avoiding", complete: false};
        const eighth: ISubTopic = {name: "FAQs", link: "topics/safety/faqs", complete: false};
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
