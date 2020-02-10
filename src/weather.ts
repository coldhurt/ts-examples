import commander from 'commander'
import colors from 'colors'
import axios from 'axios'

interface IWeatherResponse {
  status: string
  count: string
  info: string
  infocode: string
  lives: ILive[]
  forecasts: IForecast[]
}

interface ICity {
  city: string
  adcode: string
  province: string
  reporttime: string
}

interface ILive extends ICity {
  weather: string
  temperature: string
  winddirection: string
  windpower: string
  humidity: string
}

interface IForecast extends ICity {
  casts: ICast[]
}

interface ICast {
  date: string
  week: string
  dayweather: string
  nightweather: string
  daytemp: string
  nighttemp: string
  daywind: string
  nightwind: string
  daypower: string
  nightpower: string
}

const command = commander
  .version('0.1.0')
  .option('-c --city [name]', 'city name')
  .option('-e --extensions <type>', 'weather info type: base or all', 'base')
  .parse(process.argv)

if (process.argv.length <= 2) {
  commander.outputHelp(colors.red)
  process.exit()
}

const log = console.log

function getWeather(cmd: commander.Command) {
  axios
    .get(
      `https://restapi.amap.com/v3/weather/weatherInfo?key=50c061a6f17459a592be7a8c58783162&city=${encodeURI(
        cmd.city
      )}&extensions=${cmd.extensions}`
    )
    .then(res => {
      const data = res.data as IWeatherResponse
      if (data.lives && data.lives.length > 0) {
        const live = data.lives[0]
        log(colors.yellow(live.reporttime))
        log(colors.white(`${live.province} ${live.city}`))
        log(colors.green(`${live.weather} ${live.temperature}°C`))
      } else if (data.forecasts && data.forecasts.length > 0) {
        const forecast = data.forecasts[0]
        log(colors.yellow(forecast.reporttime))
        log(
          colors.white(
            `${forecast.province} ${forecast.city} 未来${forecast.casts.length}天天气情况：`
          )
        )
        for (const cast of forecast.casts) {
          log(colors.white('---------------------------------'))
          log(colors.yellow(`${cast.date} ${cast.week}`))
          log(colors.green(`白天：${cast.dayweather} ${cast.daytemp} °C`))
          log(colors.blue(`晚上：${cast.nightweather} ${cast.nighttemp} °C`))
        }
      } else {
        log(colors.red('cant find any info'))
      }
    })
    .catch(res => {
      console.error('服务出错', res)
    })
}

getWeather(command)
