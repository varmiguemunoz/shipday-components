$('.pricing-table-tabwise-btn').on('click', (ev) => {
  $('.pricing-table-tabwise-btn').removeClass('selected')
  $('.pricing-table-tabwise-wrapper').removeClass('high-lighted-tab')
  ev.currentTarget.classList.add('selected')
  let packName = $('.pricing-table-tabwise-btn.selected').attr('pack-type')
  if (packName === 'branded') {
    $('.pricing-table-tabwise-wrapper').addClass('high-lighted-tab')
  }
  $('.pricing-table-tabwise-common').hide()
  $('.pricing-table-tabwise-' + packName).show()
})

$('.plus-button').on('click', (ev) => {
  let currentText = $(ev.currentTarget).children('.show-plans-btn-text').text()
  if (currentText.includes('Show')) {
    $(ev.currentTarget).children('.pricing-expend-plus').hide()
    $(ev.currentTarget).children('.pricing-expend-minus').show()
    $(ev.currentTarget)
      .children('.show-plans-btn-text')
      .addClass('text-color-grey')
    $(ev.currentTarget)
      .children('.show-plans-btn-text')
      .text('Hide plan features')
  } else {
    $(ev.currentTarget).children('.pricing-expend-plus').show()
    $(ev.currentTarget).children('.pricing-expend-minus').hide()
    $(ev.currentTarget)
      .children('.show-plans-btn-text')
      .removeClass('text-color-grey')
    $(ev.currentTarget)
      .children('.show-plans-btn-text')
      .text('Show plan features')
  }
})

let priceList = null
let countryCode = null
let totalCostWithSMS = null
let totalCostWithoutSMS = null
let professionalCount = 300
let brandedCount = 300
const PROFESSIONAL_COST_MAP = {
  0.04: 750,
  0.05: 600,
  0.06: 500,
  0.07: 450,
  0.08: 375,
  0.09: 350,
  '0.10': 300,
  0.13: 230
}

$('.costperorder').text('')
$('.baseordercount').text('')

//geojs function
$.get('https://get.geojs.io/v1/ip/geo.json')
  .done(function (json) {
    console.log(json)
    geoip(json)
  })
  .fail(function () {
    countryCode = 'US'
    if (priceList) updatePriceValues(priceList, countryCode)
    $('.costperorder').text('0.10')
    $('.baseordercount').text('300')
    $('.branded_baseordercount').text('300')
    $('.branded_costperorder').text('0.20')
  })

// get direction ip
function geoip(json) {
  countryCode = json.country_code
  if (countryCode !== 'US' && countryCode !== 'CA') {
    $('.with_or_without_sms_div').css('display', 'flex')
    if ($('#without_sms_branded').hasClass('selected')) {
      $('.branded_baseordercount').text('500')
      $('.branded_costperorder').text('0.10')
    } else {
      $('.branded_baseordercount').text('300')
      $('.branded_costperorder').text('0.20')
    }
  } else {
    $('.price-short-tag').addClass('has-no-sms-btn')
    $('.branded_baseordercount').text('300')
    $('.branded_costperorder').text('0.20')
  }
  if (priceList) {
    updatePriceValues(priceList, countryCode)
  }
}

//funcion para traer la lista de precios
function fetchPriceList() {
  return $.ajax({
    url: 'https://subscription.shipday.com/payment/countries',
    dataType: 'json'
  })
}

// funcion para actualizar el precio de los valores y
function updatePriceValues(priceList, countryCode) {
  const country = priceList.find((item) => item.iso === countryCode)
  if (country) {
    totalCostWithoutSMS = country.costPerOrder
    totalCostWithSMS = country.costPerSms + country.costPerOrder
    if (totalCostWithSMS < 0) {
      totalCostWithSMS = '0.10'
    }

    if (totalCostWithoutSMS < 0) {
      totalCostWithoutSMS = '0.05'
    }

    withSMSCost = totalCostWithSMS
    withoutSMSCost = totalCostWithoutSMS

    if ($('#with_sms_professional').hasClass('selected')) {
      let baseOrderCount =
        PROFESSIONAL_COST_MAP[Number(totalCostWithSMS).toFixed(2)] || 300
      $('.costperorder').text(Number(totalCostWithSMS).toFixed(2))
      $('.baseordercount').text(baseOrderCount)
      professionalCount = baseOrderCount
    } else {
      let baseOrderCount =
        PROFESSIONAL_COST_MAP[Number(totalCostWithoutSMS).toFixed(2)] || 300
      $('.costperorder').text(Number(totalCostWithoutSMS).toFixed(2))
      $('.baseordercount').text(baseOrderCount)
      professionalCount = baseOrderCount
    }
  } else {
    withSMSCost = '0.10'
    withoutSMSCost = '0.05'
    $('.costperorder').text('0.10')
    $('.baseordercount').text('300')
  }
  $('#order_quantity').on('change', (ev) => {
    updateCalculationBasedOnPrice(
      ev.target.value,
      countryCode,
      totalCostWithSMS,
      totalCostWithoutSMS
    )
    $('.pricing-table-tabwise-btn[pack-type=professional]').click()
  })
}

$('#without_sms_professional, #without_sms_professional_mobile').on(
  'click',
  () => {
    $('#without_sms_professional, #without_sms_professional_mobile').addClass(
      'selected'
    )
    $('#with_sms_professional, #with_sms_professional_mobile').removeClass(
      'selected'
    )

    let baseOrderCount =
      PROFESSIONAL_COST_MAP[Number(totalCostWithoutSMS).toFixed(2)] || 300
    professionalCount = baseOrderCount
    $('.costperorder').text(Number(totalCostWithoutSMS).toFixed(2))
    $('.baseordercount').text(baseOrderCount)
    updateCalculationBasedOnPrice(
      $('#order_quantity').val(),
      countryCode,
      totalCostWithSMS,
      totalCostWithoutSMS
    )
  }
)

$('#with_sms_professional, #with_sms_professional_mobile').on('click', () => {
  $('#with_sms_professional, #with_sms_professional_mobile').addClass(
    'selected'
  )
  $('#without_sms_professional, #without_sms_professional_mobile').removeClass(
    'selected'
  )

  let baseOrderCount =
    PROFESSIONAL_COST_MAP[Number(totalCostWithSMS).toFixed(2)] || 300
  professionalCount = baseOrderCount
  $('.costperorder').text(Number(totalCostWithSMS).toFixed(2))
  $('.baseordercount').text(baseOrderCount)
  updateCalculationBasedOnPrice(
    $('#order_quantity').val(),
    countryCode,
    totalCostWithSMS,
    totalCostWithoutSMS
  )
})

fetchPriceList()
  .then((priceListArr) => {
    priceList = priceListArr
    if (countryCode) {
      updatePriceValues(priceList, countryCode)
    }
  })
  .catch((error) => {
    $('.costperorder').text('0.10')
    $('.baseordercount').text('300')
  })

$('#without_sms_branded, #without_sms_branded_mobile').on('click', () => {
  $('#without_sms_branded, #without_sms_branded_mobile').addClass('selected')
  $('#with_sms_branded, #with_sms_branded_mobile').removeClass('selected')

  $('.branded_baseordercount').text('500')
  $('.branded_costperorder').text('0.10')
  brandedCount = 500
  updateCalculationBasedOnPrice(
    $('#order_quantity').val(),
    countryCode,
    totalCostWithSMS,
    totalCostWithoutSMS
  )
})

$('#with_sms_branded, #with_sms_branded_mobile').on('click', () => {
  $('#with_sms_branded, #with_sms_branded_mobile').addClass('selected')
  $('#without_sms_branded, #without_sms_branded_mobile').removeClass('selected')

  $('.branded_baseordercount').text('300')
  $('.branded_costperorder').text('0.20')
  brandedCount = 300
  updateCalculationBasedOnPrice(
    $('#order_quantity').val(),
    countryCode,
    totalCostWithSMS,
    totalCostWithoutSMS
  )
})

fbq('track', 'PricingPage')

const updateMainVal = (
  count,
  additionalCostPro,
  additionalCostBranded,
  additionalCostBusiness
) => {
  let prof = (count - professionalCount) * additionalCostPro + 29
  let branded = (count - brandedCount) * additionalCostBranded + 79
  let business = (count - 1000) * additionalCostBusiness + 299

  prof = prof < 29 ? 29 : prof
  branded = branded < 79 ? 79 : branded
  business = business < 299 ? 299 : business

  $('.professional_calc_price').text(prof)
  $('.branded_calc_price').text(branded)
  $('.business_calc_price').text(business)
}

const updateCalculationBasedOnPrice = (
  count,
  countryCode,
  professionalWithSMS,
  professionalWithoutSMS
) => {
  let brandedWithoutSMS = 0.1
  let brandedWithSMS = 0.2
  let business = 0.25
  if (countryCode !== 'US' && countryCode !== 'CA') {
    let targetCostBranded = $('#with_sms_branded').hasClass('selected')
      ? brandedWithSMS
      : brandedWithoutSMS
    let targetCostProfessional = $('#with_sms_professional').hasClass(
      'selected'
    )
      ? professionalWithSMS
      : professionalWithoutSMS
    updateMainVal(count, targetCostProfessional, targetCostBranded, business)
  } else {
    updateMainVal(count, professionalWithSMS, brandedWithSMS, business)
  }
}
