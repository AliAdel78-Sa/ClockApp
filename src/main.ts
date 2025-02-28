import axios from "axios";
import moment from "moment-timezone";
import "./scss/main.scss";
import "./modules/navigation";
import "./pages/stopwatch";
import "./ui/nav";

/*
const unsupportedTimeZones: string[] = [
	"America/Argentina/Buenos_Aires",
	"America/Indiana/Indianapolis",
	"America/Kentucky/Louisville",
	"America/North_Dakota/Beulah",
	"CET",
	"CST6CDT",
	"Cuba",
	"EET",
	"EST",
	"EST5EDT",
	"Egypt",
	"Eire",
	"Etc/GMT+0",
	"Etc/GMT+1",
	"Etc/GMT+10",
	"Etc/GMT+11",
	"Etc/GMT+12",
	"Etc/GMT+2",
	"Etc/GMT+3",
	"Etc/GMT+4",
	"Etc/GMT+5",
	"Etc/GMT+6",
	"Etc/GMT+7",
	"Etc/GMT+8",
	"Etc/GMT+9",
	"GB",
	"GB-Eire",
	"GMT+0",
	"GMT",
	"GMT-0",
	"GMT0",
	"Greenwich",
	"HST",
	"Hongkong",
	"Iceland",
	"Israel",
	"Iran",
	"Jamaica",
	"Japan",
	"Kwajalein",
	"Libya",
	"MET",
	"MST",
	"MST7MDT",
	"NZ",
	"NZ-CHAT",
	"Navajo",
	"PRC",
	"PST8PDT",
	"Poland",
	"Portugal",
	"ROC",
	"ROK",
	"Singapore",
	"UCT",
	"Turkey",
	"W-SU",
	"UTC",
	"WET",
	"Universal",
	"Zulu",
	"America/Indiana/Knox",
	"America/Argentina/Catamarca",
	"America/Kentucky/Monticello",
	"America/North_Dakota/Center",
	"America/Indiana/Marengo",
	"America/Argentina/ComodRivadavia",
	"America/North_Dakota/New_Salem",
	"America/Indiana/Petersburg",
	"America/Argentina/Cordoba",
	"America/Indiana/Tell_City",
	"America/Argentina/Jujuy",
	"America/Indiana/Vevay",
	"America/Argentina/La_Rioja",
	"America/Indiana/Vincennes",
	"America/Argentina/Mendoza",
	"America/Indiana/Winamac",
	"America/Argentina/Rio_Gallegos",
	"America/Argentina/Salta",
	"America/Argentina/San_Juan",
	"America/Argentina/San_Luis",
	"America/Argentina/Tucuman",
	"America/Argentina/Ushuaia",
];
moment.tz.names().forEach(async (e) => {
	const continent = e.split("/")[0];
	const city = e.split("/")[1];
	if (unsupportedTimeZones.includes(e)) return;
	try {
		const { data } = await axios.get(
			`https://timeapi.io/api/time/current/zone?timeZone=${continent}%2F${city}`
		);
		// console.log(data);
	} catch (error) {
		axios.isAxiosError(error)
			? console.log(error.response?.data)
			: console.error("An unexpected error occurred:", error);
	}
});
*/
