/*!
	Real Estate List Search
	
	Copyright 2022 Zealty Online Search Inc.
	October 24, 2022
 */ "use strict";
var gSoldFlag,
  gExpiredFlag,
  gTotalCount,
  gPageCount,
  gSearchForm,
  gModalBox,
  gModalBoxStyle,
  gModalBoxKeyHandler,
  gModalBoxResizeHandler,
  gToMapDiv,
  gToStatsDiv,
  gToStrataDiv,
  gNavigationDiv,
  gFavoritesList,
  gRejectedList,
  gSortOrder,
  gTableListFlag,
  gSearchFormHidden,
  gWideScreen,
  gAgentList,
  gAgentBuy,
  gAgentDeal,
  gBrokerageList,
  gBrokerageBuy,
  gBrokerageDeal,
  gShowRealtorName,
  gHiddenVH,
  gVisibilityChangeVH,
  gAndWords,
  gOrWords,
  gNotWords,
  gReferralAgent,
  propertyDB,
  gTypeMenuButton,
  gTypeMenuModal,
  gTypeMenuPanel,
  kURLFieldID = "url",
  kTitleContainerID = "title",
  kFooterContainerID = "footer",
  kSearchFormContainerID = "searchDiv",
  kSearchFormID = "searchForm",
  kQuickSummaryID = "foundCount",
  kPropertyTileBrochureClass = "property-tile",
  kBackgroundColor = "#F8F9F9",
  kOpenHouseDayAll = "all",
  kTownEverywhereCode = "everywhere",
  kTownEverywhereName = "Anywhere",
  kMapDefault = "rebgv",
  kStatusDefault = "active",
  kHouseAgeDefault = kHouseAgeAll,
  kParkingDefault = kParkingAll,
  kOpenHouseDayDefault = kOpenHouseDayAll,
  kSortOrderActiveDefault = 1,
  kSortOrderSoldDefault = 11,
  kSortOrderExpiredDefault = 11,
  kRegionNames = [],
  kAreaValues = [],
  kAreaNames = [],
  kPriceBands = [],
  kSpinnerID = "spinner",
  kResultsAnchor = "list-top",
  kPageSize = 28,
  kVOWlimit = 100,
  kAssessmentsAvailable = [
    "vancouver",
    "mapvw",
    "mapve",
    "surrey",
    "mapfv-northsurrey",
    "mapfv-surrey",
    "mapfv-southsurrey",
    "mapfv-langley",
    "mapfv-abbotsford",
    "mapvic",
  ],
  kParkingMenu = [
    [kParkingAll, "Any"],
    ["Carport", "Carport"],
    ["Garage", "Garage"],
    ["Garage; Single", "Single Garage"],
    ["Garage; Double", "Double Garage"],
    ["Garage; Triple", "Triple Garage"],
    ["RV Parking", "Recreational Vehicle"],
  ],
  kOpenHouseDayMenu = [
    [kOpenHouseDayAll, "Any day"],
    ["saturday", "Saturday"],
    ["sunday", "Sunday"],
  ],
  kFeatureCheckboxes = [
    "waterfront",
    "view",
    "fireplace",
    "pool",
    "workshop",
    "suite",
  ],
  kFlagCheckboxes = [
    "favorite",
    "rejected",
    "openhouse",
    "virtualtour",
    "foreclosure",
  ],
  kPhotoArrowColorOn = "red",
  kPhotoLargeHeight = "250px",
  kPhotoThumbnailWidth = "150px",
  kPhotoThumbnailHeight = "110px",
  kTableListAdCount = 7,
  kGalleryListAdCount = 7,
  gDateAddedValue = "",
  gDateAddedName = "",
  gDateAddedPriceChangeValue = "",
  gDateAddedPriceChangeName = "";
function getWindowHeight() {
  return (
    window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight
  );
}
function getWindowWidth() {
  return (
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth
  );
}
function abortEvent(e) {
  e.stopPropagation ? e.stopPropagation() : (e.cancelBubble = !0);
}
function initHouseAgePopup() {
  var e,
    t,
    o = gSearchForm.elements.houseage;
  for (t of ((o.length = 0), kHouseAgeMenu))
    (e = document.createElement("option")),
      "-" == t[0] && (e.disabled = !0),
      e.setAttribute("value", t[0]),
      (e.innerHTML = t[1]),
      o.appendChild(e);
}
function initLotSizeLowPopup() {
  var e,
    t,
    o = gSearchForm.elements.lotsizelow;
  for (t of ((o.length = 0), kLotSizeMenu))
    (e = document.createElement("option")),
      "-" == t[0] ? (e.disabled = !0) : t[0] == kLotSizesAll && (t[1] = "Min"),
      e.setAttribute("value", t[0]),
      (e.innerHTML = t[1]),
      o.appendChild(e);
}
function initLotSizeHighPopup() {
  var e,
    t,
    o = gSearchForm.elements.lotsizehigh;
  for (t of ((o.length = 0), kLotSizeMenu))
    (e = document.createElement("option")),
      "-" == t[0] ? (e.disabled = !0) : t[0] == kLotSizesAll && (t[1] = "Max"),
      e.setAttribute("value", t[0]),
      (e.innerHTML = t[1]),
      o.appendChild(e);
}
function addLoadCode(e) {
  var t = window.onload;
  "function" == typeof t
    ? (window.onload = function () {
        t(), e();
      })
    : (window.onload = e);
}
function init() {
  var e,
    t,
    o,
    r,
    a,
    i,
    l,
    n,
    s,
    d,
    g,
    h,
    c,
    u,
    p,
    m,
    y,
    v,
    f,
    S,
    b,
    _,
    k,
    $,
    w,
    D = unescape(getParameter_("map", gParametersInit)),
    T =
      unescape(getParameter_("town", gParametersInit)) ||
      unescape(getParameter_("area", gParametersInit)),
    F = unescape(getParameter_("status", gParametersInit)),
    A = unescape(getParameter_("month", gParametersInit)),
    E = unescape(getParameter_("monthprice", gParametersInit)),
    P =
      unescape(getParameter_("types", gParametersInit)) ||
      unescape(getParameter_("type", gParametersInit)),
    x = unescape(getParameter_("minprice", gParametersInit)),
    C = unescape(getParameter_("maxprice", gParametersInit)),
    L = unescape(getParameter_("minbeds", gParametersInit)),
    R = unescape(getParameter_("minbaths", gParametersInit)),
    B = unescape(getParameter_("minhousesize", gParametersInit)),
    I = unescape(getParameter_("maxhousesize", gParametersInit)),
    N = unescape(getParameter_("maxhouseage", gParametersInit)),
    O = unescape(getParameter_("minlotsize", gParametersInit)),
    z = unescape(getParameter_("maxlotsize", gParametersInit)),
    H = unescape(getParameter_("features", gParametersInit)),
    W = unescape(getParameter_("parking", gParametersInit)),
    V = unescape(getParameter_("flags", gParametersInit)),
    j = unescape(getParameter_("openhouseday", gParametersInit)),
    K = unescape(getParameter_("query", gParametersInit)),
    Y = unescape(getParameter_("table", gParametersInit)),
    U = unescape(getParameter_("sort", gParametersInit)),
    q = unescape(getParameter_("hideform", gParametersInit)),
    G = unescape(getParameter_("agentlist", gParametersInit)),
    Z = unescape(getParameter_("agentbuy", gParametersInit)),
    Q = unescape(getParameter_("agentdeal", gParametersInit)),
    X = unescape(getParameter_("brokeragelist", gParametersInit)),
    J = unescape(getParameter_("brokeragebuy", gParametersInit)),
    ee = unescape(getParameter_("brokeragedeal", gParametersInit)),
    et = getCookie(kCurrentListCookie);
  if (
    ((gSoldFlag = !1),
    (gExpiredFlag = !1),
    (gTableListFlag = !1),
    (gSearchFormHidden = !0),
    (gAgentList = ""),
    (gAgentBuy = ""),
    (gAgentDeal = ""),
    (gBrokerageList = ""),
    (gBrokerageBuy = ""),
    (gBrokerageDeal = ""),
    (gSortOrder = 0),
    (gShowRealtorName = !1),
    (gWideScreen = screen.width > 480),
    initModalDialog(),
    document
      .getElementById("keyword")
      .setAttribute("placeholder", kSearchNumberPrompt),
    (document.getElementById("poweredByLogo").innerHTML =
      "<img src='" +
      kPoweredByLogoURL +
      "' style='height: 24px;' alt='Powered by Zealty.ca'>"),
    showLastUpdated(),
    (propertyDB = []),
    (gSearchForm = document.getElementById(kSearchFormID)),
    initHouseAgePopup(),
    initLotSizeLowPopup(),
    initLotSizeHighPopup(),
    (document.getElementById("disclaimer").innerHTML = kTermsOfUseBoard),
    (document.getElementById(kTitleContainerID).innerHTML = kTitleListHTML),
    (document.getElementById(kTitleContainerID).className = kNoprintClass),
    ((gNavigationDiv = document.createElement("div")).style.cssText =
      "position: absolute; top: 1px; right: 5px;"),
    ((gToMapDiv = document.createElement("div")).className =
      "module-button module-button-display"),
    (gToMapDiv.innerHTML =
      "<i class='fas fa-map-marked-alt' style='color: white;'></i>&nbsp;&nbsp;Map Search"),
    (gToMapDiv.title = " Go to Map Search "),
    (gToMapDiv.onclick = function () {
      var e = kMapClientURL;
      window.open(e, "_self");
    }),
    gNavigationDiv.appendChild(gToMapDiv),
    ((gToStatsDiv = document.createElement("div")).className =
      "module-button module-button-display"),
    (gToStatsDiv.innerHTML =
      "<i class='fas fa-chart-bar' style='color: white;'></i>&nbsp;&nbsp;Statistics"),
    (gToStatsDiv.title = " Go to Statistics "),
    (gToStatsDiv.onclick = function () {
      var e = kStatsClientURL;
      window.open(e, "_self");
    }),
    gNavigationDiv.appendChild(gToStatsDiv),
    ((gToStrataDiv = document.createElement("div")).className =
      "module-button module-button-display"),
    (gToStrataDiv.innerHTML =
      "<i class='fas fa-building' style='color: white;'></i>&nbsp;&nbsp;Strata Browser"),
    (gToStrataDiv.title = " Go to Strata Browser "),
    (gToStrataDiv.onclick = function () {
      var e = kStrataClientURL;
      window.open(e, "_self");
    }),
    gNavigationDiv.appendChild(gToStrataDiv),
    document.getElementById(kTitleContainerID).appendChild(gNavigationDiv),
    "vreb" == D && (D = "vireb"),
    (kMapName = D || et || kMapDefault),
    initDatabasePopup(),
    getRegionInfo(kMapName),
    initTownPopup(),
    initAgePopup(),
    initAgePriceChangePopup(),
    initAgePopupSold(),
    initPricePopups(),
    initTypeMenu(),
    typeMenuSet(),
    initLogin(),
    doAction(!0),
    K && (gSearchForm.query.value = K),
    F && ((F = F.trim().toLowerCase()), (gSearchForm.status.value = F)),
    A)
  ) {
    if ((n = (A = A.trim().toLowerCase()).split("-")).length > 1)
      switch (
        ((l = new Date()),
        2 == n.length
          ? (h = getDateRange((s = n[0]) + "-" + (d = n[1])))
          : 3 == n.length &&
            ((s = n[0]),
            (h = getDateRange(s + "-" + (d = n[1]) + "-" + (g = n[2])))),
        (y = "0-0"),
        (v = "1-1"),
        (f = getDateRange(
          (s = l.getFullYear()) + "-" + (d = l.getMonth() + 1)
        )),
        (c = s),
        0 == (u = d - 1) && ((u = 12), c--),
        (S = getDateRange(c + "-" + u)),
        (b =
          "0-" +
          Math.round(
            (l.setHours(23) - new Date(l.getFullYear(), 0, 1, 0, 0, 0)) /
              kMillisecondsPerDay
          ) -
          1),
        (_ =
          Math.floor(
            (l.getTime() - new Date(l.getFullYear(), 0, 1).getTime()) /
              kMillisecondsPerDay
          ) +
          "-" +
          Math.floor(
            (l.getTime() - new Date(l.getFullYear() - 1, 0, 1).getTime()) /
              kMillisecondsPerDay
          )),
        h)
      ) {
        case y:
          A = "today";
          break;
        case v:
          A = "yesterday";
          break;
        case f:
          A = "this-month";
          break;
        case S:
          A = "last-month";
          break;
        case b:
          A = "this-year";
          break;
        case _:
          A = "last-year";
      }
    "all" == A
      ? "active" == gSearchForm.status.value
        ? (gSearchForm.ageactive.value = kAgeAll)
        : (gSearchForm.agesold.value = 1095)
      : ("active" == gSearchForm.status.value && kAgeValues.indexOf(A) > -1) ||
        ("active" != gSearchForm.status.value && kAgeValuesSold.indexOf(A) > -1)
      ? "active" == gSearchForm.status.value
        ? (gSearchForm.ageactive.value = A)
        : (gSearchForm.agesold.value = A)
      : (1 == (n = A.split("-")).length
          ? ((p = A = parseInt(A, 10)), (m = "Last " + A + " Days"))
          : ((p = getDateRange(A)),
            (s = n[0]),
            (d = parseInt(n[1], 10)),
            (d = kMonthNamesFull[d - 1]),
            (m =
              3 == n.length
                ? d + " " + (g = parseInt(n[2], 10).toString()) + ", " + s
                : d + " " + s)),
        "active" == gSearchForm.status.value
          ? appendAgePopup(p, m)
          : appendAgePopupSold(p, m),
        (gDateAddedValue = p),
        (gDateAddedName = A));
  }
  if (E) {
    if ((n = (E = E.trim().toLowerCase()).split("-")).length > 1)
      switch (
        ((l = new Date()),
        2 == n.length
          ? (h = getDateRange((s = n[0]) + "-" + (d = n[1])))
          : 3 == n.length &&
            ((s = n[0]),
            (h = getDateRange(s + "-" + (d = n[1]) + "-" + (g = n[2])))),
        (y = "0-0"),
        (v = "1-1"),
        (f = getDateRange(
          (s = l.getFullYear()) + "-" + (d = l.getMonth() + 1)
        )),
        (c = s),
        0 == (u = d - 1) && ((u = 12), c--),
        (S = getDateRange(c + "-" + u)),
        (b =
          "0-" +
          Math.round(
            (l.setHours(23) - new Date(l.getFullYear(), 0, 1, 0, 0, 0)) /
              kMillisecondsPerDay
          ) -
          1),
        (_ =
          Math.floor(
            (l.getTime() - new Date(l.getFullYear(), 0, 1).getTime()) /
              kMillisecondsPerDay
          ) +
          "-" +
          Math.floor(
            (l.getTime() - new Date(l.getFullYear() - 1, 0, 1).getTime()) /
              kMillisecondsPerDay
          )),
        h)
      ) {
        case y:
          E = "today";
          break;
        case v:
          E = "yesterday";
          break;
        case f:
          E = "this-month";
          break;
        case S:
          E = "last-month";
          break;
        case b:
          E = "this-year";
          break;
        case _:
          E = "last-year";
      }
    "all" == E
      ? (gSearchForm.agePriceChangeFilter.value = kAgeAll)
      : kAgeValues.indexOf(E) > -1
      ? (gSearchForm.agePriceChangeFilter.value = E)
      : (1 == (n = E.split("-")).length
          ? ((p = E = parseInt(E, 10)), (m = "Last " + E + " Days"))
          : ((p = getDateRange(E)),
            (s = n[0]),
            (d = parseInt(n[1], 10)),
            (d = kMonthNamesFull[d - 1]),
            (m =
              3 == n.length
                ? d + " " + (g = parseInt(n[2], 10).toString()) + ", " + s
                : d + " " + s)),
        appendAgePriceChangePopup(p, m),
        (gDateAddedPriceChangeValue = p),
        (gDateAddedPriceChangeName = E));
  }
  if (P) {
    for (
      (gTypeMenuValue = P.split(",")).forEach(function (e, t) {
        gTypeMenuValue[t] = e.trim().toLowerCase();
      }),
        gTypeMenuValue.indexOf("all") > -1 &&
          (gTypeMenuValue = kTypeMenuValuesResidential),
        e = 0;
      e < gTypeMenuValue.length;
      e++
    )
      for (t = 0; t < kTypeMenuItemValues.length; t++)
        if (gTypeMenuValue[e] == kTypeMenuItemValues[t].toLowerCase()) {
          gTypeMenuValue[e] = kTypeMenuItemValues[t];
          break;
        }
    typeMenuSet();
  }
  if (T) {
    for (i of ((T = T.trim().toLowerCase()), (o = !1), kAreaValues))
      if (T == i.toLowerCase()) {
        (T = i), (o = !0);
        break;
      }
    o || (T = kTownEverywhereCode), (gSearchForm.town.value = T);
  }
  if (
    (x && ((x = x.trim().toLowerCase()), (gSearchForm.pricelow.value = x)),
    C && ((C = C.trim().toLowerCase()), (gSearchForm.pricehigh.value = C)),
    L && ((L = L.trim().toLowerCase()), (gSearchForm.bedrooms.value = L)),
    R && ((R = R.trim().toLowerCase()), (gSearchForm.bathrooms.value = R)),
    B && ((B = B.trim().toLowerCase()), (gSearchForm.housesizelow.value = B)),
    I && ((I = I.trim().toLowerCase()), (gSearchForm.housesizehigh.value = I)),
    N)
  ) {
    for (k of ((N = N.trim().toLowerCase()), (o = !1), kHouseAgeMenu))
      if (N == k[0].toLowerCase()) {
        (N = k[0]), (o = !0);
        break;
      }
    o || (N = kHouseAgeDefault), (gSearchForm.houseage.value = N);
  }
  if (
    (O && ((O = O.trim().toLowerCase()), (gSearchForm.lotsizelow.value = O)),
    z && ((z = z.trim().toLowerCase()), (gSearchForm.lotsizehigh.value = z)),
    W)
  ) {
    for ($ of ((W = W.trim().toLowerCase()), (o = !1), kParkingMenu))
      if (W == $[0].toLowerCase()) {
        (W = $[0]), (o = !0);
        break;
      }
    o || (W = kParkingDefault), (gSearchForm.parkinginfo.value = W);
  }
  if (
    (H &&
      (r = H.split(",")).forEach(function (e, t) {
        var o = e.trim().toLowerCase();
        try {
          gSearchForm.elements[o].checked = !0;
        } catch (r) {}
      }),
    V &&
      (a = V.split(",")).forEach(function (e, t) {
        var o = e.trim().toLowerCase();
        try {
          gSearchForm.elements[o].checked = !0;
        } catch (r) {}
      }),
    j)
  ) {
    for (w of ((j = j.trim().toLowerCase()), (o = !1), kOpenHouseDayMenu))
      if (j == w[0].toLowerCase()) {
        (j = w[0]), (o = !0);
        break;
      }
    o || (j = kOpenHouseDayDefault), (gSearchForm.openhouseday.value = j);
  }
  G && (gAgentList = G = G.trim()),
    Z && (gAgentBuy = Z = Z.trim()),
    Q && (gAgentDeal = Q = Q.trim()),
    X && (gBrokerageList = X = X.trim()),
    J && (gBrokerageBuy = J = J.trim()),
    ee && (gBrokerageDeal = ee = ee.trim()),
    Y && (gTableListFlag = "1" == (Y = Y.trim().toLowerCase())),
    U && (gSortOrder = parseInt((U = U.trim().toLowerCase()), 10)),
    q && (gSearchFormHidden = "1" == (q = q.trim().toLowerCase())),
    setCookie(kCurrentListCookie, kMapName, 1825),
    showSearchForm(),
    doChange(!0, U),
    savePreferences(),
    installVisibilityHandler(),
    installFocusHandler(),
    (window.onorientationchange = onWindowResize),
    (window.onresize = onWindowResize),
    onWindowResize();
}
function onWindowResize() {
  var e =
    getWindowHeight() -
    document.getElementById(kTitleContainerID).offsetHeight -
    document.getElementById(kFooterContainerID).offsetHeight -
    2;
  document.getElementById("container").style.height = e + "px";
}
function initDatabasePopup() {
  var e,
    t,
    o,
    r,
    a,
    i,
    l = document.getElementById("database");
  for (o of ((a = !0), kMapInfo))
    for (r of ((i = !0), o.maps))
      (t = document.createElement("option")).setAttribute("value", r.value),
        (t.innerHTML = r.name),
        r.value == kMapName && (t.selected = !0),
        i &&
          (a ||
            (((e = document.createElement("option")).innerHTML = ""),
            (e.disabled = !0),
            l.appendChild(e)),
          ((e = document.createElement("option")).innerHTML =
            o.groupLabel + " &darr;"),
          (e.disabled = !0),
          l.appendChild(e),
          (i = !1),
          (a = !1)),
        l.appendChild(t);
  kMapName = l.value;
}
function initTownPopup() {
  for (var e, t, o = gSearchForm.town; o.firstChild; )
    o.removeChild(o.firstChild);
  for (e = 0; e < kAreaNames.length; e++)
    "" == kAreaNames[e] && (kAreaNames[e] = kAreaValues[e]),
      (t = document.createElement("option")),
      kAreaValues[e] == kTownEverywhereCode && (t.selected = !0),
      t.setAttribute("value", kAreaValues[e]),
      (t.innerHTML = kAreaNames[e]),
      o.appendChild(t);
}
function initPricePopups() {
  for (
    var e, t, o, r = gSearchForm.pricelow, a = gSearchForm.pricehigh;
    r.firstChild;

  )
    r.removeChild(r.firstChild);
  for (; a.firstChild; ) a.removeChild(a.firstChild);
  for (t of ((o = document.createElement("option")).setAttribute(
    "value",
    kPriceLowest
  ),
  (o.innerHTML = "Min"),
  r.appendChild(o),
  (o = o.cloneNode(!1)).setAttribute("value", kPriceHighest),
  (o.innerHTML = "Max"),
  a.appendChild(o),
  kPriceBands))
    (o = o.cloneNode(!1)).setAttribute("value", t),
      (o.innerHTML = formatPrice(t)),
      r.appendChild(o),
      (o = o.cloneNode(!0)),
      a.appendChild(o);
  for (e = 0; e < r.options.length; e++)
    if (r.options[e].value == kPriceLowDefault) {
      r.selectedIndex = e;
      break;
    }
  for (e = 0; e < a.options.length; e++)
    if (a.options[e].value == kPriceHighDefault) {
      a.selectedIndex = e;
      break;
    }
}
function initAgePopup() {
  var e,
    t,
    o = gSearchForm.ageactive;
  for (e = 0; e < kAgeNames.length; e++)
    (t = document.createElement("option")),
      "-" == kAgeValues[e] && (t.disabled = !0),
      t.setAttribute("value", kAgeValues[e]),
      (t.innerHTML = kAgeNames[e]),
      o.appendChild(t);
}
function appendAgePopup(e, t) {
  var o,
    r = gSearchForm.ageactive;
  ((o = document.createElement("option")).disabled = !0),
    o.setAttribute("value", "-"),
    (o.innerHTML = "Custom date &darr;"),
    r.appendChild(o),
    (o = document.createElement("option")).setAttribute("value", e),
    (o.innerHTML = t),
    r.appendChild(o),
    (r.value = e);
}
function initAgePriceChangePopup() {
  var e,
    t,
    o = gSearchForm.agePriceChangeFilter;
  for (e = 0; e < kAgeNames.length; e++)
    (t = document.createElement("option")),
      "-" == kAgeValues[e] && (t.disabled = !0),
      t.setAttribute("value", kAgeValues[e]),
      (t.innerHTML =
        "Anytime" == kAgeNames[e] ? "Never or Anytime" : kAgeNames[e]),
      o.appendChild(t);
}
function appendAgePriceChangePopup(e, t) {
  var o,
    r = gSearchForm.agePriceChangeFilter;
  ((o = document.createElement("option")).disabled = !0),
    o.setAttribute("value", "-"),
    (o.innerHTML = "Custom date &darr;"),
    r.appendChild(o),
    (o = document.createElement("option")).setAttribute("value", e),
    (o.innerHTML = t),
    r.appendChild(o),
    (r.value = e);
}
function initAgePopupSold() {
  var e,
    t,
    o = gSearchForm.agesold;
  for (e = 0; e < kAgeNamesSold.length; e++)
    (t = document.createElement("option")),
      "-" == kAgeValuesSold[e] && (t.disabled = !0),
      t.setAttribute("value", kAgeValuesSold[e]),
      (t.innerHTML = kAgeNamesSold[e]),
      o.appendChild(t);
}
function appendAgePopupSold(e, t) {
  var o,
    r = gSearchForm.agesold;
  ((o = document.createElement("option")).disabled = !0),
    o.setAttribute("value", "-"),
    (o.innerHTML = "Custom date &darr;"),
    r.appendChild(o),
    (o = document.createElement("option")).setAttribute("value", e),
    (o.innerHTML = t),
    r.appendChild(o),
    (r.value = e);
}
function M(
  e,
  t,
  o,
  r,
  a,
  i,
  l,
  n,
  s,
  d,
  g,
  h,
  c,
  u,
  p,
  m,
  y,
  v,
  f,
  S,
  b,
  _,
  k,
  $,
  w,
  D,
  T,
  F,
  A,
  E,
  P,
  x,
  C,
  L,
  R,
  B,
  I,
  N,
  O,
  z,
  H,
  W,
  V,
  j,
  K,
  Y,
  U,
  q,
  G,
  Z,
  Q,
  X,
  J,
  ee,
  et,
  eo,
  er,
  ea,
  ei,
  el,
  en,
  es,
  ed,
  eg,
  eh,
  ec,
  eu,
  ep,
  em,
  ey,
  ev,
  ef,
  eS,
  eb,
  e_,
  ek,
  e$,
  ew,
  eD,
  eT,
  eF,
  eA,
  eE,
  eM,
  eP,
  ex,
  eC,
  eL,
  eR,
  eB,
  eI,
  eN,
  eO,
  ez,
  eH,
  e0,
  eW,
  e1,
  eV,
  ej,
  e3,
  eK,
  e2,
  e6,
  e7,
  eY,
  e5,
  eU,
  e4,
  eq,
  eG,
  e8,
  e9,
  eZ,
  eQ,
  eX,
  eJ,
  te,
  tt,
  to,
  tr,
  ta,
  ti,
  tl,
  tn,
  ts,
  td,
  tg,
  th,
  tc,
  tu,
  tp,
  tm,
  ty,
  tv,
  tf,
  tS,
  tb,
  t_,
  tk,
  t$,
  tw,
  tD
) {
  var tT,
    tF,
    tA,
    tE,
    tM,
    tP = {},
    tx = s;
  "" == t && (t = o);
  var tC = t.split("/", 3),
    tL = g.split("/", 3),
    tR = x.split("/", 3),
    tB = o.split("/", 3),
    tI = new Date().getTime();
  return (
    eX == kREA && (eX = "Apartment" == p ? kAPT : kTWN),
    (tP.inFoundSet = !1),
    (tP.isMarked = !1),
    (tP.theListingDate = new Date(tC[2], tC[0] - 1, tC[1])),
    (tP.theEntryDate = new Date(tB[2], tB[0] - 1, tB[1])),
    "A" == tu
      ? ((tP.theSoldDate = ""),
        (tP.DOMactual = Math.floor(
          (tI - tP.theListingDate.getTime()) / kMillisecondsPerDay
        )),
        (tP.DOM = Math.floor(
          (tI - tP.theEntryDate.getTime()) / kMillisecondsPerDay
        )),
        tP.DOM < 0 && (tP.DOM = 0))
      : "S" == tu
      ? ((tP.theSoldDate = new Date(tR[2], tR[0] - 1, tR[1])),
        (tP.DOMactual = Math.floor(
          (tP.theSoldDate.getTime() - tP.theListingDate.getTime()) /
            kMillisecondsPerDay
        )),
        (tP.DOM = Math.floor(
          (tI - tP.theEntryDate.getTime()) / kMillisecondsPerDay
        )),
        (s = P))
      : ((tP.DOMactual = Math.floor(
          (tP.theEntryDate.getTime() - tP.theListingDate.getTime()) /
            kMillisecondsPerDay
        )),
        (tP.DOM = Math.floor(
          (tI - tP.theEntryDate.getTime()) / kMillisecondsPerDay
        ))),
    F > 0 ? (tM = (F / kSquareFeetPerAcre).toFixed(2)) : ((tM = 0), (F = "")),
    "" == x && g && d != s
      ? ((tP.thePriceOldDate = new Date(tL[2], tL[0] - 1, tL[1])),
        (tP.DOMprice = Math.floor(
          (tI - tP.thePriceOldDate.getTime()) / kMillisecondsPerDay
        )),
        tP.DOMprice < 0 && (tP.DOMprice = 0))
      : ((tP.thePriceOldDate = ""), (tP.DOMprice = -1)),
    "" == n && ((n = C), (C = "")),
    (tP.theStreetAddress = i),
    (tP.theUnitNumber = th),
    (tP.theCondoName = l),
    (tP.theTown = n),
    (tP.theCity = C),
    (tP.theProvince = tv),
    (tP.thePostalCode = I.toUpperCase()),
    (tP.thePrice = s),
    (tP.thePriceAsking = tx),
    (tP.thePriceSold = P),
    (tP.thePriceOld = d),
    (tP.theTaxes = h),
    (tP.theTaxesYear = c),
    (tP.theBedroomCount = $),
    (tP.theBathroomCount = w),
    (tP.theRealtor = v),
    (tP.theRealtorPhone = f),
    (tP.theRealtorEmail = S),
    (tP.theBrokerage = b),
    (tP.theHouseAge = _),
    (tP.theHouseSize = k),
    (tP.theLotSize = F),
    (tP.theLotSizeAcres = tM),
    (tP.theLotFrontage = D),
    (tP.theLotDepth = T),
    (tP.theFeatures = A),
    (tP.theBasement = E),
    (tP.theDescription = y),
    (tP.theNotes = ""),
    (tP.notesLoaded = !1),
    (tP.theRealtorURL = u),
    (tP.thePropertyClass = p),
    (tP.thePropertyStyle = m),
    (tP.thePictureBigList = tc),
    (tP.thePictureCount = L),
    (tP.theMLSnumber = e),
    (tP.theVirtualTour = R),
    (tP.theRoof = N),
    (tP.theFuel = O),
    (tP.theWater = z),
    (tP.theZoning = H),
    (tP.theFireplace = ey),
    (tP.theOutdoor = ev),
    (tP.theParking = ef),
    (tP.theSuite = eS),
    (tP.theExposure = eb),
    (tP.theStrataRules = e_),
    (tP.theStrataFee = ek),
    (tP.thePadRental = e$),
    (tP.theConstruction = ew),
    (tP.theFoundation = eD),
    (tP.theFlooring = eT),
    (tP.theExterior = eF),
    (tP.theUnfinished = eL),
    (tP.theLevels = eR),
    (tP.theRenovations = eB),
    (tP.theParkingAccess = eI),
    (tP.theSewer = ej),
    (tP.theLandArea = eK),
    (tP.theAssessLand = e2),
    (tP.theAssessBldg = e6),
    (tT = []),
    eM > 0 && tT.push(formatNumber(eM) + "&nbsp;Main"),
    eA > 0 && tT.push(formatNumber(eA) + "&nbsp;Above"),
    eE > 0 && tT.push(formatNumber(eE) + "&nbsp;Above&nbsp;2"),
    eP > 0 && tT.push(formatNumber(eP) + "&nbsp;Below"),
    ex > 0 && tT.push(formatNumber(ex) + "&nbsp;Bsmt"),
    tT.length > 0
      ? tT.length > 1
        ? (tP.theFinished =
            tT.join(" &#43; ") + " = " + formatNumber(eC) + "&nbsp;sqft")
        : ((tT[0] = parseInt(tT[0].replace(/,/g, ""), 10)),
          (tP.theFinished = formatNumber(tT[0]) + " sqft"))
      : (tP.theFinished = ""),
    (tA = []),
    W && tA.push(W),
    V && tA.push(V),
    j && tA.push(j),
    K && tA.push(K),
    Y && tA.push(Y),
    U && tA.push(U),
    q && tA.push(q),
    G && tA.push(G),
    Z && tA.push(Z),
    Q && tA.push(Q),
    X && tA.push(X),
    J && tA.push(J),
    ee && tA.push(ee),
    et && tA.push(et),
    eo && tA.push(eo),
    er && tA.push(er),
    ea && tA.push(ea),
    ei && tA.push(ei),
    el && tA.push(el),
    en && tA.push(en),
    es && tA.push(es),
    ed && tA.push(ed),
    eg && tA.push(eg),
    eh && tA.push(eh),
    ec && tA.push(ec),
    eu && tA.push(eu),
    ep && tA.push(ep),
    em && tA.push(em),
    (tE = []),
    eN && tE.push(eN),
    eO && tE.push(eO),
    ez && tE.push(ez),
    eH && tE.push(eH),
    e0 && tE.push(e0),
    eW && tE.push(eW),
    e1 && tE.push(e1),
    eV && tE.push(eV),
    (tP.theRooms = tA),
    (tP.theBathrooms = tE),
    (tP.theCable = e7),
    (tP.theGas = eY),
    (tP.theElectricity = e5),
    (tP.theTelephone = eU),
    (tP.theStorm = e4),
    (tP.theFencing = eq),
    (tP.theAccess = eG),
    (tP.theFlood = e9),
    (tP.theRestrictions = eZ),
    (tP.thePropertyClassCode = eX),
    (tP.thePID = eJ),
    (tP.theSellingAgent = te),
    (tP.theSellingBrokerage = tt),
    (tP.theBoard = to),
    (tP.theRegion = tr),
    (tP.theTitle = ti),
    (tP.thePriceOrig = tl),
    (tP.theOpenHouse = tn),
    (tP.foreclosure = ts),
    (tP.theCommission = td),
    (tP.theStrataPlan = tg),
    (tP.theAssessmentRatio = B),
    (tF = tu.toLowerCase()),
    (tP.theStatus =
      "cancel protected" == tF
        ? "Cancelled"
        : "hold all action" == tF
        ? "On Hold"
        : "conditional terminated" == tF
        ? "Terminated"
        : tu),
    (tP.theListingAgent2 = tf),
    (tP.theListingAgent3 = tb),
    (tP.theListingBrokerage2 = tS),
    (tP.theListingBrokerage3 = t_),
    (tP.theSellingAgent2 = tk),
    (tP.theSellingAgent3 = tw),
    (tP.theSellingBrokerage2 = t$),
    (tP.theSellingBrokerage3 = tD),
    (tP.theBrochureURL = tp),
    (tP.theSecondDwellingSize = tm),
    (tP.theManufacturedType = ty),
    tP
  );
}
function toggleFavorite(e) {
  var t,
    o,
    r = getIndexFromID(e);
  r > -1 &&
    ((o = (t = propertyDB[r]).theMarker),
    (t.isMarked = !t.isMarked),
    t.isMarked
      ? gFavoritesList.push(e)
      : (r = gFavoritesList.indexOf(e)) > -1 && gFavoritesList.splice(r, 1),
    savePreferences(),
    gSearchForm.favorite.checked && doSearch(1, !1),
    setFavorite("favorite", e));
}
function setFavorite(e, t) {
  var o = getIndexFromID(t);
  if (o > -1) {
    var r = propertyDB[o].isMarked,
      a = document.getElementById(e + "-" + t),
      i = document.getElementById(e + "-overlay-" + t);
    (a.className = (r ? "fas" : "far") + " fa-heart fa-stack-2x"),
      (a.style.color = "red"),
      (i.style.color = "transparent");
  }
}
function enterFavorite(e, t) {
  var o = getIndexFromID(t);
  if (o > -1) {
    var r = propertyDB[o].isMarked,
      a = document.getElementById(e + "-" + t),
      i = document.getElementById(e + "-overlay-" + t);
    (a.className = "fas fa-heart fa-stack-2x"),
      (a.style.color = "red"),
      (i.className = "fas fa-" + (r ? "minus" : "plus") + " fa-stack-1x"),
      (i.style.color = "white"),
      (i.title = r
        ? " Remove from favourites list "
        : " Add to favourites list ");
  }
}
function showFoundList(e, t) {
  var o;
  if (
    ((document.getElementById("searchResults").innerHTML = getFoundList(
      e,
      kTableListAdCount,
      kGalleryListAdCount
    )),
    gTableListFlag)
  )
    for (o = 0; o < kTableListAdCount; o++)
      try {
        showAdvertising2("advertising-" + o, "728x90");
      } catch (r) {}
  else
    for (o = 0; o < kGalleryListAdCount; o++)
      try {
        showAdvertising2("advertising-" + o, "300x250");
      } catch (a) {}
  t &&
    document
      .getElementById(kResultsAnchor)
      .scrollIntoView({ behavior: "smooth" });
}
function getFoundList(e, t, o) {
  var r,
    a,
    i,
    l,
    n,
    s,
    d,
    g,
    h,
    c,
    u,
    p,
    m,
    y,
    v,
    f,
    S,
    b,
    _,
    k,
    $,
    w,
    D,
    T,
    F,
    A,
    E,
    P,
    x,
    C,
    L,
    R,
    B,
    I,
    N,
    O,
    z,
    H,
    W,
    V,
    j,
    K,
    Y,
    U,
    q,
    G,
    Z,
    Q,
    X,
    J,
    ee,
    et,
    eo,
    er,
    ea,
    ei,
    el,
    en,
    es,
    ed,
    eg,
    eh,
    ec,
    eu,
    ep,
    em,
    ey = "",
    ev = gSearchForm.elements.rejected.checked;
  for (r = 0, ep = []; r < t; r++)
    ep.push(Math.floor(Math.random() * kPageSize));
  for (r = 0, eu = []; r < o; r++)
    eu.push(Math.floor(Math.random() * kPageSize));
  if (0 == propertyDB.length)
    (ey += "<div style='text-align: center;'>"),
      (ey +=
        "<span style='font-size: larger; font-weight: bold; color: red;'>"),
      (ey += "No matching properties found."),
      (ey += "</span>"),
      (ey += "</div>"),
      (ec = ""),
      (eh = "");
  else {
    for (
      gTableListFlag
        ? ((a = (gSoldFlag ? 8 : 7) + (gWideScreen ? 1 : 0)),
          (ey += "<div class='table-container'>"),
          (ey += "<div class='search-table'>"),
          (ey += "<table class='stripedTable'>"),
          (ey += "<tr class='header-row'>"),
          gWideScreen && (ey += "<th class='header-cell'></th>"),
          (ey += "<th class='header-cell'>MLS&reg; #</th>"),
          (ey += "<th class='header-cell'>Address</th>"),
          (ey += "<th class='header-cell'>Property Info</th>"),
          (ey += "<th class='header-cell'>Size</th>"),
          gSoldFlag
            ? (ey +=
                "<th class='header-cell' style='text-align: right;'>Sale Price</th>")
            : (ey +=
                "<th class='header-cell' style='text-align: right;'>Asking Price</th>"),
          (ey += "<th class='header-cell'>Date</th>"),
          (ey += "<th class='header-cell'>Seller's Agent</th>"),
          gSoldFlag && (ey += "<th class='header-cell'>Buyer's Agent</th>"),
          (ey += "</tr>"))
        : (ey += "<div style='text-align: center;'>"),
        r = 0;
      r < propertyDB.length;
      r++
    )
      !(!ev & in_array((eg = propertyDB[r]).theMLSnumber, gRejectedList)) &&
        !(!in_array(eg.theMLSnumber, gRejectedList) & ev) &&
        (getRandomAgentByRegion(eg.theRegion),
        gTableListFlag
          ? (in_array(r, ep) &&
              ((em = ep.indexOf(r)),
              (ey += "<tr class='noprint' style='text-align: center;'>"),
              (ey += "<td class='table-cell' colspan='" + a + "'>"),
              (ey += "<div id='advertising-" + em + "'></div>"),
              (ey += "</td>"),
              (ey += "</tr>")),
            (p = eg.thePrice),
            (m = eg.thePriceAsking),
            (y = Math.abs(eg.thePriceSold)),
            (v = eg.thePriceOrig),
            (f = eg.thePriceOld),
            (l = eg.theMLSnumber),
            (b = eg.theStreetAddress),
            (_ = eg.theCity),
            (k = eg.theTown),
            (d = eg.theProvince),
            ($ = eg.thePostalCode),
            (w = eg.theCondoName),
            (D = eg.theSuite),
            (F = eg.thePropertyClassCode),
            (A = eg.thePropertyStyle),
            (T = eg.thePropertyClass),
            (Q = eg.theTitle),
            (E = eg.foreclosure),
            (P = eg.theLotSize),
            (x = eg.theLotSizeAcres),
            (C = eg.theBedroomCount),
            (L = eg.theBathroomCount),
            (R = eg.theHouseSize),
            (B = eg.theAssessLand),
            (I = eg.theAssessBldg),
            (O = eg.theListingDate),
            (W = eg.theEntryDate),
            (z = eg.theSoldDate),
            (K = eg.DOMactual),
            (Y = eg.DOMprice),
            (U = eg.theFeatures),
            (i = eg.isMarked),
            (q = eg.theAssessmentRatio),
            (G = eg.theStatus),
            (Z = eg.theOpenHouse),
            (J = eg.theStrataFee),
            (ee = eg.thePadRental),
            (X = eg.theStrataPlan),
            (Q = eg.theTitle),
            (n = (s = eg.thePictureBigList
              ? eg.thePictureBigList.split("|")
              : []).length),
            _ == k && (_ = ""),
            (N = B + I),
            (et = -1 != U.indexOf("Waterfront Property")),
            (ey += "<tr>"),
            gWideScreen &&
              ((ey +=
                "<td class='table-cell' style='padding: 0px; width: " +
                kPhotoThumbnailWidth +
                ";'>"),
              (ey +=
                "<div style='position: relative; width: " +
                kPhotoThumbnailWidth +
                ";'>"),
              n > 1 &&
                ((ey +=
                  "<div class='zealty' id='arrow-left-" +
                  l +
                  "' style='position: absolute; top: 37px; left: 3px; z-index: 10;'>"),
                (ey +=
                  "<i class='far fa-arrow-alt-circle-left zealty-transition noprint' style='font-size: xx-large;' onmouseover='this.style.color=\"" +
                  kPhotoArrowColorOn +
                  '"; this.style.cursor="pointer";\' onmouseout=\'this.style.color="inherit";\' onclick=\'showPreviousPhoto("' +
                  l +
                  "\"); this.style.cursor=\"default\"; abortEvent(event);' title=' Show previous picture '></i>"),
                (ey += "</div>"),
                (ey +=
                  "<div class='zealty' id='arrow-right-" +
                  l +
                  "' style='position: absolute; top: 37px; right: 3px; z-index: 10;'>"),
                (ey +=
                  "<i class='far fa-arrow-alt-circle-right zealty-transition noprint' style='font-size: xx-large;' onmouseover='this.style.color=\"" +
                  kPhotoArrowColorOn +
                  '"; this.style.cursor="pointer";\' onmouseout=\'this.style.color="inherit";\' onclick=\'showNextPhoto("' +
                  l +
                  "\"); this.style.cursor=\"default\"; abortEvent(event);' title=' Show next picture '></i>"),
                (ey += "</div>")),
              (ey += "<div class='" + kOverlayClass + "'>"),
              (ey += "<div id='" + l + "-photo-count'>"),
              n > 0 ? (ey += "1 of " + n) : (ey += "No photos yet"),
              (ey += "</div>"),
              eg.theVirtualTour &&
                ((ey +=
                  "<div style='font-size: larger; border-top: 1px solid black;' title=' Show video tour '>"),
                (ey +=
                  "<a href='" +
                  eg.theVirtualTour +
                  "' target='_blank' onclick='abortEvent(event);'>"),
                (ey += "<i class='fas fa-video' style='color: orange;'></i>"),
                (ey += "</a>"),
                (ey += "</div>")),
              (ey += "</div>"),
              n > 0
                ? (ey +=
                    "<img loading='lazy' id='" +
                    l +
                    "-photo' data-photo-index='0' src='" +
                    s[0] +
                    "' style='width: " +
                    kPhotoThumbnailWidth +
                    ";'>")
                : (ey +=
                    "<div style='background-color: " +
                    kPhotoBackgroundColor +
                    "; height: " +
                    kPhotoThumbnailHeight +
                    "; width: " +
                    kPhotoThumbnailWidth +
                    ";'></div>"),
              (ey += "</div>"),
              (ey += "</td>")),
            (ey += "<td class='table-cell' style='text-align: center;'>"),
            (ey +=
              "<div style='margin: 5px 0; white-space: nowrap;' title=' Show expanded information sheet in new window '>"),
            (ey +=
              "<button class='tall linkMLS' type='button' onclick='showDataSheet(\"" +
              l +
              "\", 0, false); abortEvent(event);' style='white-space: nowrap;'>"),
            (ey += " "),
            (ey += l),
            (ey += "</button>"),
            (ey += "</div>"),
            (ey += "<div style='margin-bottom: 5px;'>"),
            (ey +=
              "<span class='fa-stack' style='font-size: larger; cursor: pointer;'>"),
            (ey +=
              "<i id='favorite-" +
              l +
              "' class='" +
              (i ? "fas" : "far") +
              " fa-heart fa-stack-2x' style='background-color: transparent; color: red;'></i>"),
            (ey +=
              "<i id='favorite-overlay-" +
              l +
              "' class='fas fa-plus fa-stack-1x' style='color: " +
              (i ? "red" : "transparent") +
              ';\' onmouseover=\'enterFavorite("favorite", "' +
              l +
              '");\' onmouseout=\'setFavorite("favorite", "' +
              l +
              "\");' onclick='toggleFavorite(\"" +
              l +
              "\");'></i>"),
            (ey += "</span>"),
            (ey += "</div>"),
            (ey += "<div style='margin-bottom: 5px;'>"),
            ev
              ? ((ey +=
                  "<div onclick='toggleRejected(\"" +
                  l +
                  '"); doSearch(' +
                  e +
                  ", false);' onmouseover='this.style.color = \"red\";' onmouseout='this.style.color = \"black\";' style='color: black; cursor: pointer;' title=' Remove from rejected list '>"),
                (ey +=
                  "<i id='rejected-" +
                  l +
                  "' class='fa-solid fa-thumbs-down' style='font-size: 28px;'></i>"),
                (ey += "</div>"))
              : ((ey +=
                  "<div onclick='toggleRejected(\"" +
                  l +
                  '"); doSearch(' +
                  e +
                  ", false);' onmouseover='this.style.color = \"red\";' onmouseout='this.style.color = \"black\";' style='color: black; cursor: pointer;' title=' Add to rejected list '>"),
                (ey +=
                  "<i id='rejected-" +
                  l +
                  "' class='fa-regular fa-thumbs-down' style='font-size: 28px;'></i>"),
                (ey += "</div>")),
            (ey += "</div>"),
            (ey += "</td>"),
            (ey += "<td class='table-cell' style='white-space: nowrap;'>"),
            (ey += "<div>"),
            (ey += b),
            (ey += "</div>"),
            (es = ""),
            w && w.toLowerCase() != k.toLowerCase()
              ? ((es += "<div style='font-style: italic;'>"),
                (es += w),
                X &&
                  in_array(Q, kStrataOwnershipTypes) &&
                  ((es += "&nbsp;"),
                  (es +=
                    "<div class='zealty' style='display: inline; cursor: pointer;'><i class='fas fa-building zealty-transition' title=' Show info on strata building ' onclick='showStrataInfo(\"" +
                    (
                      X +
                      '", "' +
                      w +
                      " " +
                      ("" == S ? b : b.replace("# " + S + " ", "")) +
                      " " +
                      ("" == eg.theCity ? eg.theTown : eg.theCity)
                    ).replace(/'/g, "%27") +
                    "\");' onmouseover='this.style.color=\"black\";' onmouseout='this.style.color=\"inherit\";'></i></div>")),
                (es += "</div>"))
              : X &&
                in_array(Q, kStrataOwnershipTypes) &&
                ((es += "<div style='font-style: italic;'>"),
                (es += "Strata Plan " + X),
                (es += "&nbsp;"),
                (es +=
                  "<div class='zealty' style='display: inline; cursor: pointer;'><i class='fas fa-building zealty-transition' title=' Show info on strata building ' onclick='showStrataInfo(\"" +
                  (
                    X +
                    '", "' +
                    ("" == S ? b : b.replace("# " + S + " ", "")) +
                    " " +
                    ("" == eg.theCity ? eg.theTown : eg.theCity)
                  ).replace(/'/g, "%27") +
                  "\");' onmouseover='this.style.color=\"black\";' onmouseout='this.style.color=\"inherit\";'></i></div>"),
                (es += "</div>")),
            (ey += es),
            (ey += "<div>"),
            (ey += ("" == _ ? k : _) + " " + d),
            (ey += "<div style='font-size: smaller;'>"),
            (ey += k && _ && k != _ ? "(" + k + ") " : ""),
            (ey += $.toUpperCase()),
            (ey += "</div>"),
            (ey += "</div>"),
            "S" == G
              ? ((ey += "<div style='color: red; font-weight: bold;'>"),
                (ey += "SOLD"),
                (ey += "</div>"))
              : "A" != G
              ? ((ey += "<div style='color: red; font-weight: bold;'>"),
                (ey += G.toUpperCase()),
                (ey += "</div>"))
              : ((ey += "<div style='color: green; font-weight: bold;'>"),
                (ey += "FOR SALE"),
                (ey += "</div>"),
                Z &&
                  ((ey +=
                    "<div class='overlayOH' style='position: static; display: inline-block;'>"),
                  (ey += getOpenHouseInfo(l, Z, !1)),
                  (ey += "</div>"),
                  (ey +=
                    "<div id='comments-" +
                    l +
                    "' style='width: 100%; white-space: normal; font-size: small; max-width: 300px;'></div>"))),
            (ey += "<div class='zealty'>"),
            (ey +=
              "<span style='font-size: 28px; cursor: pointer;' onmouseover='this.style.color=\"red\";' onmouseout='this.style.color=\"inherit\";' onclick='showDescription(\"" +
              l +
              "\");' title=' Show property description '>"),
            (ey +=
              "<i class='fas fa-info-circle zealty-transition noprint'></i>"),
            (ey += "</span>"),
            (ey += "</div>"),
            (ey += "</td>"),
            (ey += "<td class='table-cell' style='white-space: nowrap;'>"),
            (ey += "<div>"),
            (ey += "Lot" == T ? "Vacant Lot" : T),
            (ey += "</div>"),
            A != T &&
              ((ey += "<div style='font-size: smaller;'>"),
              (ey += A),
              (ey += "</div>")),
            in_array(D, ["", "None"]) ||
              ("Other" == D && (D += " Suite"),
              (ey += "<div style='font-size: smaller;'>"),
              (ey += D),
              (ey += "</div>")),
            2 != F &&
              ((ed =
                "A" == G
                  ? new Date().getFullYear() - eg.theHouseAge
                  : eg.theEntryDate.getFullYear() - eg.theHouseAge),
              999 == eg.theHouseAge
                ? (c = "Old Timer")
                : eg.theHouseAge <= 0
                ? ((c = "Newly Built"), (c += " (" + ed + ")"))
                : ((c =
                    eg.theHouseAge +
                    " year" +
                    (1 == eg.theHouseAge ? "" : "s") +
                    " old"),
                  (c += " (" + ed + ")")),
              (ey += "<div style='font-size: smaller; white-space: nowrap;'>"),
              (ey += c),
              (ey += "</div>")),
            Q &&
              ((ey +=
                "<div style='font-size: smaller; white-space: nowrap; color: " +
                (eo = (er = !in_array(Q, [
                  "Freehold NonStrata",
                  "Freehold Strata",
                  "Freehold",
                  "Condominium/Strata",
                  "Strata",
                  "Bare Land Condo",
                ]))
                  ? "red"
                  : "black") +
                ";'>"),
              (ey += Q),
              (ey += "</div>")),
            et &&
              ((ey +=
                "<div style='font-size: larger; font-weight: bold; font-variant: small-caps; white-space: nowrap;'>"),
              (ey += "waterfront"),
              (ey += "</div>")),
            1 == E &&
              ((ey +=
                "<div style='font-size: larger; font-weight: bold; font-variant: small-caps; white-space: nowrap;'>"),
              (ey += "court-ordered sale"),
              (ey += "</div>")),
            (ey += "</td>"),
            (ey +=
              "<td class='table-cell' style='text-align: center; white-space: nowrap;'>"),
            2 == F
              ? x > 0 &&
                ((ey += "Lot Size"),
                (ey += "<div style='font-size: smaller;'>"),
                (ey += x + " ac"),
                x < 0.25 &&
                  ((ey += "<br>"), (ey += "(" + formatNumber(P) + " sqft)")),
                (ey += "</div>"))
              : (eg.thePropertyClassCode == kCOM
                  ? R > 0 && (ey += "Building Size")
                  : ((ey += "House Size"),
                    (ey += "<div style='font-size: smaller;'>"),
                    (g = C + " bed"),
                    (h = Math.floor(L).toString()),
                    L != Math.floor(L) && (bathh += "&frac12;"),
                    (ey += g + " &bull; " + h + " bath"),
                    (ey += "</div>")),
                R > 0 &&
                  ((ey += "<div style='font-size: smaller;'>"),
                  (ey += formatNumber(R) + " sqft"),
                  (ey += "</div>")),
                x > 0 &&
                  ((ey +=
                    "<div style='border-top: 1px solid black; margin-top: 2px;'>"),
                  (ey += "Lot Size"),
                  (ey += "<div style='font-size: smaller;'>"),
                  (ey += x + " acre"),
                  x < 0.25 &&
                    ((ey += "<br>"), (ey += "(" + formatNumber(P) + " sqft)")),
                  (ey += "</div>"),
                  (ey += "</div>"))),
            (ey +=
              "<td class='table-cell' style='white-space: nowrap; text-align: right;" +
              ("S" == G && p > v ? " background-color: lightgreen;" : "") +
              "'>"),
            (ey += "<div style='position: relative;'>"),
            (ey +=
              "<div style='font-size: 14pt; font-weight: bold; color: green;'>"),
            p > 0 ? (ey += formatPrice(p)) : (ey += "$CALL"),
            (ey += "</div>"),
            "S" == G &&
              p > 0 &&
              ((ey += "<div style='font-size: smaller;'>"),
              (ey += "ask " + formatPrice(m)),
              (ea = y != m ? round((100 * Math.abs(y - m)) / m, 1) : "0"),
              (ey += ea =
                " <span style='font-weight: bold; color: " +
                (y >= m ? "green" : "red") +
                ";'>(" +
                (y > m
                  ? "<i class='fas fa-arrow-up'></i>"
                  : y < m
                  ? "<i class='fas fa-arrow-down'></i>"
                  : "") +
                ea +
                "%)</span>"),
              (ey += "</div>")),
            gUserName &&
              p > 0 &&
              (f > 0 &&
                f != v &&
                ((ea = p != f ? round((100 * Math.abs(p - f)) / f, 1) : "0"),
                (ea =
                  " <span style='font-weight: bold; color: " +
                  (p >= f ? "green" : "red") +
                  ";'>(" +
                  (p > f
                    ? "<i class='fas fa-arrow-up'></i>"
                    : p < f
                    ? "<i class='fas fa-arrow-down'></i>"
                    : "") +
                  ea +
                  "%)</span>"),
                (ey += "<div style='font-size: smaller;'>"),
                (ey += "prev " + formatPrice(f) + ea),
                (ey += "</div>")),
              v > 0 &&
                ((ea = p != v ? round((100 * Math.abs(p - v)) / v, 1) : "0"),
                (ea =
                  " <span style='font-weight: bold; color: " +
                  (p >= v ? "green" : "red") +
                  ";'>(" +
                  (p > v
                    ? "<i class='fas fa-arrow-up'></i>"
                    : p < v
                    ? "<i class='fas fa-arrow-down'></i>"
                    : "") +
                  ea +
                  "%)</span>"),
                (ey += "<div style='font-size: smaller;'>"),
                (ey += "orig " + formatPrice(v) + ea),
                (ey += "</div>"))),
            N > 0 &&
              ((in_array(eg.thePropertyClassCode, [0, 1, kMUF]) && 0 == I) ||
                ((ea = p != N ? round(100 * Math.abs(1 - p / N), 1) : "0"),
                (ey +=
                  "<div style='font-size: smaller; border-top: 1px solid black;'>"),
                (ey += "assessment " + formatPrice(N)),
                (ey += "</div>"),
                q > 0 &&
                  ((ey += "<div style='font-size: smaller;'>"),
                  (ey += "price:assess ratio "),
                  (ey +=
                    "<span style='font-weight: bold; color: " +
                    (eg.theAssessmentRatio < 1 ? "red" : "green") +
                    ";'>"),
                  (ey += round(100 * eg.theAssessmentRatio, 1) + "%"),
                  (ey += "</span>"),
                  (ey += "</div>")))),
            J > 0 &&
              ((ey +=
                "<div style='border-top: 1px solid black; margin-top: 2px;'>"),
              (ey +=
                "<div style='font-size: smaller;'>Maint. fee $" +
                formatNumber(J) +
                "</div>"),
              (ey += "</div>")),
            ee > 0 &&
              gUserName &&
              ((ey +=
                "<div style='border-top: 1px solid black; margin-top: 2px;'>"),
              (ey +=
                "<div style='font-size: smaller;'>Pad fee $" +
                formatNumber(ee) +
                "</div>"),
              (ey += "</div>")),
            "S" == G &&
              p > v &&
              ((ey +=
                "<div style='font-weight: bold; font-variant: small-caps; white-space: nowrap;'>"),
              (ey += "sold over orig ask"),
              (ey += "</div>")),
            (ey += "</div>"),
            (ey += "</td>"),
            (ei = W.getFullYear()),
            (el = W.getMonth()),
            (en = W.getDate()) < 10 && (en = "0" + en),
            (V = ei + "-" + kMonthNamesAbbrev[el] + "-" + en),
            (ey +=
              "<td class='table-cell' style='text-align: center; white-space: nowrap;'>"),
            "A" == G &&
              eg.thePriceOldDate &&
              ((ei = eg.thePriceOldDate.getFullYear()),
              (el = eg.thePriceOldDate.getMonth()),
              (en = eg.thePriceOldDate.getDate()) < 10 && (en = "0" + en),
              (j = ei + "-" + kMonthNamesAbbrev[el] + "-" + en),
              (ey +=
                "<div style='border-bottom: 1px solid black; padding: 2px 0;'>"),
              (ey += "Price Change"),
              (ey += "<div>"),
              (ey += "<span style='font-family: monospace;'>" + j + "</span>"),
              (ey += "<div style='font-size: smaller;'>"),
              (ey += "("),
              Y > -1 &&
                (0 == Y
                  ? (ey += "today")
                  : (ey += Y + " day" + (1 == Y ? "" : "s") + " ago")),
              (ey += ")"),
              (ey += "</div>"),
              (ey += "</div>"),
              (ey += "</div>")),
            gUserName
              ? ((ey += "<div>"),
                (ey +=
                  "S" == G
                    ? "Sale Reported"
                    : "A" != G
                    ? "Off Market"
                    : "Listing Entered"),
                (ey += "<div style='font-family: monospace;'>" + V + "</div>"),
                (ey += "</div>"),
                "S" == G &&
                  ((ei = z.getFullYear()),
                  (el = z.getMonth()),
                  (en = z.getDate()) < 10 && (en = "0" + en),
                  (H = ei + "-" + kMonthNamesAbbrev[el] + "-" + en),
                  (ey +=
                    "<div style='border-top: 1px solid black; margin-top: 2px;'>"),
                  (ey += "Sale Date"),
                  (ey +=
                    "<div style='font-family: monospace;'>" + H + "</div>"),
                  (ey += "</div>")),
                (ey += "<div style='font-size: smaller;'>"),
                (ey += "("),
                0 == K && "A" == G
                  ? (ey += "today")
                  : (ey += K + " day" + (1 == K ? "" : "s") + " on market"),
                (ey += ")"),
                (ey += "</div>"))
              : (ey += "(log in for date)"),
            (ey += "</td>"),
            (ey += "<td class='table-cell'>"),
            (ey += "<div>"),
            (ey += eg.theBrokerage),
            eg.theRealtor &&
              (gShowRealtorName ||
                (kShowListingAgent &&
                  "A" == eg.theStatus &&
                  !gReferralAgent)) &&
              ((ey += "<div style='font-size: smaller; font-style: italic;'>"),
              eg.theRealtorEmail
                ? ((ey += "<i class='fa-regular fa-envelope'></i>"),
                  (ey += " "),
                  (ey +=
                    "<a href='mailto:" +
                    eg.theRealtorEmail +
                    "?subject=" +
                    escape("Re: " + eg.theStreetAddress + " property") +
                    "'>"),
                  (ey += eg.theRealtor),
                  (ey += "</a>"))
                : (ey += eg.theRealtor),
              eg.theRealtorPhone &&
                ((ey += "<div style='white-space: nowrap;'>"),
                (ey += "<a href='tel:" + eg.theRealtorPhone + "'>"),
                (ey += "<i class='fa-solid fa-phone'></i>"),
                (ey += eg.theRealtorPhone),
                (ey += "</a>"),
                (ey += "</div>")),
              (ey += "</div>")),
            eg.theListingBrokerage2 &&
              ((ey += "<div style='margin-top: 5px;'>"),
              (ey += eg.theListingBrokerage2),
              (gShowRealtorName ||
                (kShowListingAgent &&
                  "A" == eg.theStatus &&
                  !gReferralAgent)) &&
                eg.theListingAgent2 &&
                ((ey +=
                  "<div style='font-size: smaller; font-style: italic;'>"),
                (ey += eg.theListingAgent2),
                (ey += "</div>")),
              (ey += "</div>")),
            eg.theListingBrokerage3 &&
              ((ey += "<div style='margin-top: 5px;'>"),
              (ey += eg.theListingBrokerage3),
              (gShowRealtorName ||
                (kShowListingAgent &&
                  "A" == eg.theStatus &&
                  !gReferralAgent)) &&
                eg.theListingAgent3 &&
                ((ey +=
                  "<div style='font-size: smaller; font-style: italic;'>"),
                (ey += eg.theListingAgent3),
                (ey += "</div>")),
              (ey += "</div>")),
            (ey += "</div>"),
            "A" == eg.theStatus &&
              eg.theCommission &&
              (userIsPrivileged() || kShowCommission) &&
              ((ey +=
                "<div style='font-size: x-small; max-width: 400px; margin-top: 5px; padding: 5px 0px; border-top: 1px solid black;'>"),
              (ey += "Buyer's agent commission: " + eg.theCommission),
              (ey += "</div>")),
            (ey += "</td>"),
            gSoldFlag &&
              ((ey += "<td class='table-cell' style='white-space: nowrap;'>"),
              (ey += "<div>"),
              (ey += eg.theSellingBrokerage),
              gShowRealtorName &&
                eg.theSellingAgent &&
                ((ey +=
                  "<div style='font-size: smaller; font-style: italic;'>"),
                (ey += eg.theSellingAgent),
                (ey += "</div>")),
              eg.theSellingBrokerage2 &&
                ((ey += "<div style='margin-top: 5px;'>"),
                (ey += eg.theSellingBrokerage2),
                gShowRealtorName &&
                  eg.theSellingAgent2 &&
                  ((ey +=
                    "<div style='font-size: smaller; font-style: italic;'>"),
                  (ey += eg.theSellingAgent2),
                  (ey += "</div>")),
                (ey += "</div>")),
              eg.theSellingBrokerage3 &&
                ((ey += "<div style='margin-top: 5px;'>"),
                (ey += eg.theSellingBrokerage3),
                gShowRealtorName &&
                  eg.theSellingAgent3 &&
                  ((ey +=
                    "<div style='font-size: smaller; font-style: italic;'>"),
                  (ey += eg.theSellingAgent3),
                  (ey += "</div>")),
                (ey += "</div>")),
              (ey += "</div>"),
              (ey += "</td>")),
            (ey += "</tr>"))
          : ((l = eg.theMLSnumber),
            (n = (s = eg.thePictureBigList
              ? eg.thePictureBigList.split("|")
              : []).length),
            in_array(r, eu) &&
              ((em = eu.indexOf(r)),
              (ey +=
                "<div class='" +
                kPropertyTileBrochureClass +
                "' style='" +
                (gWideScreen ? "padding: 5px;" : "padding: 0 0 4px 0;") +
                " border: none;'>"),
              (ey +=
                "<div id='advertising-" +
                em +
                "' style='display: inline-block;'></div>"),
              (ey += "</div>")),
            (ey +=
              "<div class='" +
              kPropertyTileBrochureClass +
              "' style='" +
              (gWideScreen ? "padding: 5px;" : "padding: 0 0 4px 0;") +
              " border: none; cursor: pointer;' onclick='showDataSheet(\"" +
              l +
              "\", 0, false);' title=' Show expanded information sheet '>"),
            (ey += "<div class='picture-detail'>"),
            n > 1 &&
              ((ey +=
                "<div class='zealty' id='arrow-left-" +
                l +
                "' style='position: absolute; top: 80px; left: 3px; z-index: 10;'>"),
              (ey +=
                "<i class='far fa-arrow-alt-circle-left zealty-transition' style='font-size: xx-large;' onmouseover='this.style.color=\"" +
                kPhotoArrowColorOn +
                '"; this.style.cursor="pointer";\' onmouseout=\'this.style.color="inherit";\' onclick=\'showPreviousPhoto("' +
                l +
                "\"); this.style.cursor=\"default\"; abortEvent(event);' title=' Show previous picture '></i>"),
              (ey += "</div>"),
              (ey +=
                "<div class='zealty' id='arrow-right-" +
                l +
                "' style='position: absolute; top: 80px; right: 3px; z-index: 10;'>"),
              (ey +=
                "<i class='far fa-arrow-alt-circle-right zealty-transition' style='font-size: xx-large;' onmouseover='this.style.color=\"" +
                kPhotoArrowColorOn +
                '"; this.style.cursor="pointer";\' onmouseout=\'this.style.color="inherit";\' onclick=\'showNextPhoto("' +
                l +
                "\"); this.style.cursor=\"default\"; abortEvent(event);' title=' Show next picture '></i>"),
              (ey += "</div>")),
            n > 0
              ? ((ey +=
                  "<div style='overflow: hidden; height: " +
                  kPhotoLargeHeight +
                  ";'>"),
                (ey +=
                  "<img loading='lazy' id='" +
                  l +
                  "-photo' data-photo-index='0' src='" +
                  s[0] +
                  "' style='width: 100%; margin: -30px 0px 0px 0px;'>"),
                (ey += "</div>"))
              : (ey +=
                  "<div style='background-color: " +
                  kPhotoBackgroundColor +
                  "; width: 100%; height: " +
                  kPhotoLargeHeight +
                  ";'></div>"),
            "S" == eg.theStatus
              ? (ey +=
                  "<div class='ribbon-wrapper'><div class='ribbon'>SOLD</div></div>")
              : "A" != eg.theStatus
              ? (ey +=
                  "<div class='ribbon-wrapper'><div class='ribbon'>" +
                  eg.theStatus +
                  "</div></div>")
              : eg.DOM <= kRecentListingMaxAge
              ? (ey +=
                  "<div class='ribbon-wrapper'><div class='ribbon'>NEW</div></div>")
              : -1 != eg.DOMprice && eg.DOMprice <= kRecentPriceChangeMaxAge
              ? (ey +=
                  "<div class='ribbon-wrapper'><div class='ribbon'>New Price</div></div>")
              : propertyIsFeatured(r) &&
                (ey +=
                  "<div class='ribbon-wrapper'><div class='ribbon'>FEATURED</div></div>"),
            (ey += "<div class='" + kOverlayClass + "'>"),
            (ey += "<div id='" + l + "-photo-count'>"),
            n > 0
              ? ((ey += "<i class='fas fa-images' style='color: orange;'></i>"),
                (ey += "&nbsp;"),
                (ey += "1 of " + n))
              : (ey += "No photos yet"),
            (ey += "</div>"),
            eg.theVirtualTour &&
              ((ey +=
                "<div style='font-size: larger; border-top: 1px solid black;' title=' Show video tour '>"),
              (ey +=
                "<a href='" +
                eg.theVirtualTour +
                "' target='_blank' onclick='abortEvent(event);'>"),
              (ey += "<i class='fas fa-video' style='color: orange;'></i>"),
              (ey += "</a>"),
              (ey += "</div>")),
            (ey += "</div>"),
            eg.theOpenHouse &&
              "A" == eg.theStatus &&
              ((ey +=
                "<div class='overlayOH' style='top: 1px; left: 1px; bottom: initial; right: initial;'>"),
              (ey += getOpenHouseInfo(l, eg.theOpenHouse, !1)),
              (ey += "</div>")),
            (ey += "<div class='infoBanner'>"),
            (ey += "<div style='color: white;'>"),
            (ey += "<table>"),
            (ey += "<tr style='background-color: transparent;'>"),
            (ey += "<td>"),
            (ey += getIconURL(
              eg.thePropertyClassCode,
              eg.DOM,
              eg.DOMprice,
              eg.theStatus,
              !1,
              !1,
              !0
            )),
            (ey += "</td>"),
            (ey += "<td>"),
            (ey +=
              eg.thePropertyClass == kPropertyLot
                ? "Vacant Lot"
                : eg.thePropertyClass),
            (ey += "</td>"),
            (ey += "</tr>"),
            (ey += "</table>"),
            (ey += "</div>"),
            (ey += "<div>"),
            (ey +=
              "<span style='font-size: 16pt; font-weight: bold; color: white;'>"),
            eg.thePrice > 0
              ? (ey += formatPrice(eg.thePrice))
              : (ey += "$CALL"),
            (ey += "</span>"),
            "S" == eg.theStatus
              ? ((ey += "&nbsp;"),
                (ey +=
                  "<div style='display: inline-block; font-size: x-small; font-weight: bold; color: red; background-color: white; padding: 0 2px;'>"),
                (ey +=
                  "Reported SOLD " +
                  kMonthNamesAbbrev[eg.theEntryDate.getMonth()] +
                  " " +
                  eg.theEntryDate.getDate() +
                  ", " +
                  eg.theEntryDate.getFullYear()),
                (ey += "</div>"))
              : "A" != eg.theStatus
              ? ((ey += "&nbsp;"),
                (ey +=
                  "<div style='display: inline-block; font-size: x-small; font-weight: bold; color: red; background-color: white; padding: 0 2px;'>"),
                (ey +=
                  eg.theStatus.toUpperCase() +
                  " " +
                  kMonthNamesAbbrev[eg.theEntryDate.getMonth()] +
                  " " +
                  eg.theEntryDate.getDate() +
                  ", " +
                  eg.theEntryDate.getFullYear()),
                (ey += "</div>"))
              : eg.thePriceOld > 0 &&
                eg.thePriceOld != eg.thePrice &&
                gUserName &&
                ((u =
                  (eg.thePrice > eg.thePriceOld
                    ? "<i class='fas fa-arrow-up'></i>"
                    : "<i class='fas fa-arrow-down'></i>") +
                  Math.abs(
                    round(
                      (100 * (eg.thePrice - eg.thePriceOld)) / eg.thePriceOld,
                      1
                    )
                  ) +
                  "%"),
                (ey += "&nbsp;"),
                (ey +=
                  "<div style='display: inline-block; font-size: smaller; font-weight: bold; color: " +
                  (eg.thePrice > eg.thePriceOld ? "green" : "red") +
                  "; background-color: white; opacity: var(--zealty-opacity); padding: 0 2px;'>"),
                (ey += u),
                eg.thePriceOldDate &&
                  ((ey += "&nbsp;"),
                  (ey +=
                    kMonthNamesAbbrev[eg.thePriceOldDate.getMonth()] +
                    " " +
                    eg.thePriceOldDate.getDate())),
                (ey += "</div>"),
                eg.DOMprice > -1 &&
                  ((ey += "&nbsp;"),
                  (ey +=
                    "<div style='display: inline-block; font-size: smaller; color: black; background-color: white; opacity: var(--zealty-opacity); white-space: nowrap; padding: 0 2px;'>"),
                  (ey +=
                    eg.DOMprice +
                    " day" +
                    (1 == eg.DOMprice ? "" : "s") +
                    " @ price"),
                  (ey += "</div>"))),
            (ey += "</div>"),
            (ey += "<div style='color: white; font-size: smaller;'>"),
            2 == eg.thePropertyClassCode
              ? ((g = "Lot"), (h = ""))
              : eg.thePropertyClassCode != kCOM
              ? ((g = eg.theBedroomCount + " bed"),
                (h = Math.floor((L = eg.theBathroomCount)).toString()),
                L != Math.floor(L) && (bathh += "&frac12;"),
                (ey += g + (h = " &bull; " + h + " bath")))
              : (ey += "Commercial"),
            eg.theHouseSize > 0 &&
              (ey += " &bull; " + formatNumber(eg.theHouseSize) + " sqft"),
            eg.theLotSizeAcres > 0 &&
              (ey += " &bull; " + eg.theLotSizeAcres + " ac"),
            2 != eg.thePropertyClassCode &&
              ((ed =
                "A" == eg.theStatus
                  ? new Date().getFullYear() - eg.theHouseAge
                  : eg.theEntryDate.getFullYear() - eg.theHouseAge),
              (ey +=
                " &bull; " +
                (c =
                  999 == eg.theHouseAge
                    ? "Old"
                    : eg.theHouseAge <= 0
                    ? "New"
                    : ed))),
            gUserName &&
              (ey +=
                " &bull; <div style='display: inline-block; color: black; background-color: white; padding: 0 2px; opacity: var(--zealty-opacity); white-space: nowrap;'>" +
                (0 == eg.DOMactual && "A" == eg.theStatus
                  ? "new today"
                  : eg.DOMactual + " dom") +
                "</div>"),
            (ey += "</div>"),
            (ey += "<div style='color: white; font-size: smaller;'>"),
            (ey += eg.theStreetAddress),
            (ey += "<span style='font-size: smaller;'>"),
            (ey += ", "),
            (ey +=
              ("" == eg.theCity ? eg.theTown : eg.theCity) +
              " " +
              eg.theProvince),
            (ey +=
              eg.theTown && eg.theCity && eg.theTown != eg.theCity
                ? " (" + eg.theTown + ")"
                : ""),
            (ey += "</span>"),
            (ey += "</div>"),
            (ey += "<div style='font-size: smaller; color: white;'>"),
            (ey +=
              "<button class='tall linkMLS' type='button' onclick='showDataSheet(\"" +
              l +
              "\", 0, false); abortEvent(event);' style='vertical-align: top; white-space: nowrap;'>"),
            (ey += " "),
            (ey += l),
            (ey += "</button>"),
            (ey += "&nbsp;"),
            (ey += "<div style='display: inline-block;'>"),
            eg.theBrokerage.length > 35
              ? (ey += eg.theBrokerage.substring(0, 35) + "&hellip;")
              : (ey += eg.theBrokerage),
            eg.theRealtor &&
              (gShowRealtorName ||
                (kShowListingAgent &&
                  "A" == eg.theStatus &&
                  !gReferralAgent)) &&
              ((ey += "<div>"),
              eg.theRealtorEmail
                ? ((ey +=
                    "<a href='mailto:" +
                    eg.theRealtorEmail +
                    "?subject=" +
                    escape("Re: " + eg.theStreetAddress + " property") +
                    "' style='color: white;' onclick='abortEvent(event);' title=' Email the listing agent '>"),
                  (ey += eg.theRealtor),
                  (ey += "</a>"))
                : (ey += eg.theRealtor),
              eg.theRealtorPhone &&
                ((ey += " &bull; "),
                eg.theRealtor.length > 23
                  ? ((ey +=
                      "<a href='tel:" +
                      eg.theRealtorPhone +
                      "' style='color: white;' onclick='abortEvent(event);' title=' Call the listing agent '>"),
                    (ey += "<i class='fa-solid fa-phone'></i>"),
                    (ey += "</a>"))
                  : ((ey +=
                      "<a href='tel:" +
                      eg.theRealtorPhone +
                      "' style='color: white;' onclick='abortEvent(event);' title=' Call the listing agent '>"),
                    (ey += "<i class='fa-solid fa-phone'></i>"),
                    (ey += eg.theRealtorPhone),
                    (ey += "</a>"))),
              (ey += "</div>")),
            (ey += "</div>"),
            (ey += "</div>"),
            (ey +=
              "<div style='position: absolute; bottom: 0px; right: 0px; z-index: 1000; text-align: center;'>"),
            (ey += "<div style='margin-bottom: 3px;'>"),
            (ey +=
              "<span class='fa-stack' style='font-size: larger; cursor: pointer;'>"),
            (ey +=
              "<i id='favorite-" +
              l +
              "' class='" +
              (eg.isMarked ? "fas" : "far") +
              " fa-heart fa-stack-2x' style='background-color: transparent; color: red;'></i>"),
            (ey +=
              "<i id='favorite-overlay-" +
              l +
              "' class='fas fa-plus fa-stack-1x' style='color: " +
              (eg.isMarked ? "red" : "transparent") +
              ';\' onmouseover=\'enterFavorite("favorite", "' +
              l +
              '");\' onmouseout=\'setFavorite("favorite", "' +
              l +
              "\");' onclick='toggleFavorite(\"" +
              l +
              "\"); abortEvent(event);'></i>"),
            (ey += "</span>"),
            (ey += "</div>"),
            (ey += "<div style='margin-bottom: 3px;'>"),
            ev
              ? ((ey +=
                  "<div onclick='toggleRejected(\"" +
                  l +
                  '"); doSearch(' +
                  e +
                  ", false);' onmouseover='this.style.color = \"white\";' onmouseout='this.style.color = \"red\";' style='color: red; cursor: pointer;' title=' Remove from rejected list '>"),
                (ey +=
                  "<i id='rejected-" +
                  l +
                  "' class='fa-solid fa-thumbs-down' style='font-size: 28px;'></i>"),
                (ey += "</div>"))
              : ((ey +=
                  "<div onclick='toggleRejected(\"" +
                  l +
                  '"); doSearch(' +
                  e +
                  ", false);' onmouseover='this.style.color = \"red\";' onmouseout='this.style.color = \"white\";' style='color: white; cursor: pointer;' title=' Add to rejected list '>"),
                (ey +=
                  "<i id='rejected-" +
                  l +
                  "' class='fa-regular fa-thumbs-down' style='font-size: 28px;'></i>"),
                (ey += "</div>")),
            (ey += "</div>"),
            (ey += "<div class='zealty' style='margin-bottom: 3px;'>"),
            (ey +=
              "<span style='font-size: 28px; z-index: 10; cursor: pointer;' onmouseover='this.style.color=\"red\";' onmouseout='this.style.color=\"inherit\";' onclick='showDescription(\"" +
              l +
              "\"); abortEvent(event);' title=' Show property description '>"),
            (ey +=
              "<i class='fas fa-info-circle zealty-transition noprint'></i>"),
            (ey += "</span>"),
            (ey += "</div>"),
            (ey += "</div>"),
            (ey += "</div>"),
            (ey += "</div>"),
            (ey += "</div>")));
    gTableListFlag && ((ey += "</table>"), (ey += "</div>")),
      (ey += "</div>"),
      (eh =
        "<div class='noprint' style='position: relative; background-color: white; text-align: center; border: 2px solid black; padding: 2px; margin: 1px;'>"),
      (eh += getSortPopup()),
      (eh +=
        "<div style='position: absolute; top: 3px; right: 3px; display: inline; font-size: larger; cursor: pointer;' onclick='gTableListFlag = !gTableListFlag; savePreferences(); showFoundList(" +
        e +
        ", false);'>"),
      (eh += gTableListFlag
        ? "<div class='zealty' style='display: inline;'><i class='far fa-image zealty-transition' onmouseover='this.style.color=\"black\";' onmouseout='this.style.color=\"inherit\";' title=' Show gallery list '></i></div>"
        : "<div class='zealty' style='display: inline;'><i class='fas fa-list zealty-transition' onmouseover='this.style.color=\"black\";' onmouseout='this.style.color=\"inherit\";' title=' Show table list '></i></div>"),
      (eh += "</div>"),
      (eh += "</div>"),
      (ec =
        "<div class='noprint' style='text-align: center; background-color: white; border: 2px solid black; padding: 5px 0; margin: 0px 1px;'>"),
      (ec +=
        "<button class='tall' type='button' onclick='doSearch(" +
        (e - 1) +
        ", true);' style='width: 100px; visibility: " +
        (1 == e ? "hidden" : "visible") +
        ";'>"),
      (ec += "<i class='fas fa-arrow-left'></i> Prev " + kPageSize),
      (ec += "</button>"),
      (ec += "<span style='font-weight: bold; color: red;'>"),
      (ec += "&nbsp;"),
      (ec +=
        (e - 1) * kPageSize +
        1 +
        " to " +
        ((e - 1) * kPageSize + propertyDB.length) +
        " of " +
        gTotalCount),
      (ec += "&nbsp;"),
      (ec += "</span>"),
      (ec +=
        "<button class='tall' type='button' onclick='doSearch(" +
        (e + 1) +
        ", true);' style='width: 100px; visibility: " +
        (e == gPageCount ? "hidden" : "visible") +
        ";'>"),
      (ec += "Next " + kPageSize + " <i class='fas fa-arrow-right'></i>"),
      (ec += "</button>"),
      (ec += "</div>");
  }
  return (
    (document.getElementById(kFooterContainerID).innerHTML = ec), (ey = eh + ey)
  );
}
function toggleRejected(e) {
  var t;
  in_array(e, gRejectedList)
    ? (t = gRejectedList.indexOf(e)) > -1 && gRejectedList.splice(t, 1)
    : gRejectedList.push(e),
    userSet(kRejectedCookie, gRejectedList.join(",")),
    setRejected("rejected", e);
}
function getOpenHouseInfo(e, t, o) {
  var r,
    a,
    i,
    l,
    n,
    s,
    d,
    g,
    h,
    c,
    u,
    p,
    m,
    y,
    v = 0,
    f = new Date(),
    S = "",
    b = f.getTime() + 6e4 * f.getTimezoneOffset() + 36e5 * kOffsetPacificToUTC;
  f = new Date(b);
  var _ = new Date(f.getTime() + 864e5);
  if (t) {
    for (
      r = 0, t = t.split("|");
      r < t.length &&
      ((u = t[r].split("!")),
      (t[r] = u[0].trim()),
      u.length > 1
        ? ((p = u[1].trim()), (m = (m = u[2].trim()).replace(/'/g, "&apos;")))
        : ((p = ""), (m = "")),
      (a = t[r].split(" ")),
      (i = kMonthNamesFull.indexOf(a[1])),
      (l = parseInt(a[2], 10)),
      (n = a[3]),
      " Noon" == (a = t[r].split("-"))[1] && (a[1] = " 12:00 pm"),
      (s = parseInt(a[1], 10)),
      a[1].indexOf("pm") > -1 && s < 12 && (s += 12),
      (d = parseInt((a = a[1].split(":"))[1], 10)),
      (c = new Date(n, i, l, s, d)) < f ||
        ((t[r] = t[r].replace(
          kMonthNamesFull[f.getMonth()] +
            " " +
            f.getDate() +
            ", " +
            f.getFullYear() +
            " ",
          "Today "
        )),
        (t[r] = t[r].replace(
          kMonthNamesFull[_.getMonth()] +
            " " +
            _.getDate() +
            ", " +
            _.getFullYear() +
            " ",
          "Tomorrow "
        )),
        (t[r] = t[r].replace(", " + f.getFullYear(), "")),
        o &&
          ((t[r] = t[r].substring(t[r].indexOf(", ") + 2)),
          (t[r] = t[r].replace(/ am/g, "")),
          (t[r] = t[r].replace(/ pm/g, "")),
          (t[r] = t[r].replace(/:00/g, "")),
          (t[r] = t[r].replace(/ - /g, "-")),
          (g = t[r].substring(0, t[r].indexOf(" "))),
          (h = kMonthNamesFull.indexOf(g)) > -1 &&
            (t[r] = t[r].replace(g, kMonthNamesAbbrev[h]))),
        (S +=
          "<option value='" +
          p +
          "' data-mls='" +
          e +
          "' data-comments='" +
          m +
          "'>"),
        (S += t[r] + ("" == p ? "" : " LIVE")),
        (S += "</option>"),
        (y = r),
        v++,
        !o));
      r++
    );
    v > 1
      ? (S =
          "OPEN <select onchange='changeOH(this);' onclick='abortEvent(event);' style='font-size: smaller;' title=' Choose a scheduled open house '><option value='' data-mls='" +
          e +
          "' data-comments=''>" +
          v +
          " open houses scheduled</option>" +
          S +
          "</select>")
      : ((S =
          "<span style='line-height: " +
          (o ? "10px; font-size: 9px;" : "21px;") +
          "'>"),
        1 == v
          ? (p
              ? (S +=
                  "<a href='" +
                  p +
                  "' target='_blank' style='color: white;' onclick='abortEvent(event);' title=''>OPEN " +
                  t[y] +
                  "</a> LIVE")
              : (S += "OPEN " + t[y]),
            setTimeout(function () {
              if (m)
                try {
                  document.getElementById("comments-" + e).innerHTML =
                    "<strong>Open House note: </strong>" + m;
                } catch (t) {}
            }, 10))
          : (S += "OPEN has already ended"),
        (S += "</span>"));
  }
  return S;
}
function changeOH(e) {
  var t = e.options[e.selectedIndex].getAttribute("data-mls"),
    o = e.options[e.selectedIndex].getAttribute("data-comments");
  try {
    document.getElementById("comments-" + t).innerHTML = o
      ? "<strong>Open House note: </strong>" + o
      : "";
  } catch (r) {}
  e.value && window.open(e.value);
}
function getDateOfNextWeekday(e) {
  var t = new Date();
  return -1 == e
    ? t
    : new Date(
        t.setDate(t.getDate() + ((parseInt(e, 10) + 7 - t.getDay()) % 7))
      );
}
function isMyListing(e) {
  var t = e.theRealtor.toLowerCase();
  return "" != t && t && t == kAgentName.toLowerCase();
}
function propertyIsFeatured(e) {
  var t,
    o = !1,
    r = propertyDB[e].theRealtor.toLowerCase(),
    a = kAgentNameOthers.toLowerCase().split(",");
  for (t = 0; t < a.length; t++) a[t] = a[t].trim();
  return (r == kAgentName.toLowerCase() || in_array(r, a)) && (o = !0), o;
}
function showNextPhoto(e) {
  var t,
    o = [],
    r = document.getElementById(e + "-photo"),
    a = r.getAttribute("data-photo-index"),
    i = propertyDB[getIndexFromID(e)];
  i.thePictureBigList && (o = i.thePictureBigList.split("|")),
    (t = o.length) > 0 &&
      (++a == t && (a = 0),
      r.setAttribute("data-photo-index", a),
      r.setAttribute("src", o[a]),
      gTableListFlag
        ? (document.getElementById(e + "-photo-count").innerHTML =
            a + 1 + " of " + t)
        : (document.getElementById(e + "-photo-count").innerHTML =
            "<i class='fas fa-images' style='color: orange;'></i>&nbsp;" +
            (a + 1) +
            " of " +
            t));
}
function showPreviousPhoto(e) {
  var t,
    o = [],
    r = document.getElementById(e + "-photo"),
    a = r.getAttribute("data-photo-index"),
    i = propertyDB[getIndexFromID(e)];
  i.thePictureBigList && (o = i.thePictureBigList.split("|")),
    (t = o.length) > 0 &&
      (--a < 0 && (a = t - 1),
      r.setAttribute("data-photo-index", a),
      r.setAttribute("src", o[a]),
      gTableListFlag
        ? (document.getElementById(e + "-photo-count").innerHTML =
            a + 1 + " of " + t)
        : (document.getElementById(e + "-photo-count").innerHTML =
            "<i class='fas fa-images' style='color: orange;'></i>&nbsp;" +
            (a + 1) +
            " of " +
            t));
}
function showLastUpdated() {
  loadTextFile(
    kLastUpdatedFile,
    function (e) {
      try {
        document.getElementById("lastUpdated").innerHTML = "Updated " + e;
      } catch (t) {}
    },
    !1
  );
}
function loadTextFile(e, t) {
  try {
    var o = new XMLHttpRequest();
    o.open("POST", e, !0),
      o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
      (o.onreadystatechange = function () {
        o.readyState == XMLHttpRequest.DONE &&
          200 == o.status &&
          t(o.responseText);
      }),
      o.send("r=" + Math.random());
  } catch (r) {}
}
function doAction(e) {
  (gSearchForm.excludeLeases.checked = !1),
    (gSearchForm.town.value = kTownEverywhereCode),
    (gSearchForm.status.value = kStatusDefault),
    (gSearchForm.ageactive.value = kAgeAll),
    (gSearchForm.agePriceChangeFilter.value = kAgeAll),
    (gSearchForm.agesold.value = "90"),
    (gSearchForm.pricelow.value = kPriceLowest),
    (gSearchForm.pricehigh.value = kPriceHighest),
    (gSearchForm.bedrooms.value = kBedroomsAll),
    (gSearchForm.bathrooms.value = kBathroomsAll),
    (gSearchForm.housesizelow.value = kHouseSizesAll),
    (gSearchForm.housesizehigh.value = kHouseSizesAll),
    (gSearchForm.houseage.value = kHouseAgeAll),
    (gSearchForm.lotsizelow.value = kLotSizesAll),
    (gSearchForm.lotsizehigh.value = kLotSizesAll),
    (gSearchForm.waterfront.checked = !1),
    (gSearchForm.view.checked = !1),
    (gSearchForm.fireplace.checked = !1),
    (gSearchForm.pool.checked = !1),
    (gSearchForm.workshop.checked = !1),
    (gSearchForm.suite.checked = !1),
    (gSearchForm.parkinginfo.value = kParkingAll),
    (gSearchForm.favorite.checked = !1),
    (gSearchForm.rejected.checked = !1),
    (gSearchForm.virtualtour.checked = !1),
    (gSearchForm.foreclosure.checked = !1),
    (gSearchForm.openhouse.checked = !1),
    (gSearchForm.openhouseday.value = kOpenHouseDayDefault),
    (gSearchForm.query.value = ""),
    (gSoldFlag = !1),
    (gExpiredFlag = !1),
    (document.getElementById("activeDaysPopup").style.display = "inline"),
    (document.getElementById("soldDaysPopup").style.display = "none"),
    e ||
      ((gTypeMenuValue = kTypeMenuValueDefault),
      typeMenuSet(),
      savePreferences(),
      doSearch(1, !1));
}
function doChange(e, t) {
  var o = "",
    r = kMapName;
  switch (gSearchForm.status.value) {
    case "active":
      (gSoldFlag = !1), (gExpiredFlag = !1);
      break;
    case "sold":
      (gSoldFlag = !0), (gExpiredFlag = !1);
      break;
    case "expired":
      (gSoldFlag = !1), (gExpiredFlag = !0);
  }
  e &&
    ((kMapName = document.getElementById("database").value) != r &&
      (setCookie(kCurrentListCookie, kMapName, 1825),
      getRegionInfo(kMapName),
      initTownPopup(),
      initPricePopups()),
    !t &&
      (gSoldFlag
        ? ((gSortOrder = kSortOrderSoldDefault),
          gUserName && (o = userGet(kOrderSoldListCookie)),
          o && (gSortOrder = parseInt(o, 10)))
        : gExpiredFlag
        ? ((gSortOrder = kSortOrderExpiredDefault),
          gUserName && (o = userGet(kOrderExpiredListCookie)),
          o && (gSortOrder = parseInt(o, 10)))
        : ((gSortOrder = kSortOrderActiveDefault),
          gUserName && (o = userGet(kOrderListCookie)),
          o && (gSortOrder = parseInt(o, 10))))),
    (document.getElementById("activeDaysPopup").style.display =
      gSoldFlag || gExpiredFlag ? "none" : "inline"),
    (document.getElementById("soldDaysPopup").style.display =
      gSoldFlag || gExpiredFlag ? "inline" : "none"),
    gSoldFlag
      ? (document.getElementById("soldDaysPopupTitle").innerHTML = "sold")
      : gExpiredFlag &&
        (document.getElementById("soldDaysPopupTitle").innerHTML = "expired"),
    (gSoldFlag || gExpiredFlag) && "" == gUserName
      ? (alert(
          "You must log in before you can see sold or expired properties."
        ),
        (gSoldFlag = !1),
        (gExpiredFlag = !1),
        (gSortOrder = kSortOrderActiveDefault),
        (gSearchForm.status.value = "active"))
      : e
      ? doSearch(1, !1)
      : (colorizeSearchForm(),
        (document.getElementById(kQuickSummaryID).innerHTML =
          "... click SEARCH to refresh results ..."));
}
function colorizeSearchForm() {
  (gSearchForm.town.style.color =
    gSearchForm.town.value == kTownEverywhereCode ? "black" : "red"),
    (gSearchForm.ageactive.style.color =
      gSearchForm.ageactive.value == kAgeAll ? "black" : "red"),
    (gSearchForm.agePriceChangeFilter.style.color =
      gSearchForm.agePriceChangeFilter.value == kAgeAll ? "black" : "red"),
    (gSearchForm.agesold.style.color =
      gSearchForm.agesold.value == kAgeAll ? "black" : "red"),
    (gSearchForm.pricelow.style.color =
      gSearchForm.pricelow.value == kPriceLowest ? "black" : "red"),
    (gSearchForm.pricehigh.style.color =
      gSearchForm.pricehigh.value == kPriceHighest ? "black" : "red"),
    (gSearchForm.bedrooms.style.color =
      gSearchForm.bedrooms.value == kBedroomsAll ? "black" : "red"),
    (gSearchForm.bathrooms.style.color =
      gSearchForm.bathrooms.value == kBathroomsAll ? "black" : "red"),
    (gSearchForm.housesizelow.style.color =
      gSearchForm.housesizelow.value == kHouseSizesAll ? "black" : "red"),
    (gSearchForm.housesizehigh.style.color =
      gSearchForm.housesizehigh.value == kHouseSizesAll ? "black" : "red"),
    (gSearchForm.houseage.style.color =
      gSearchForm.houseage.value == kHouseAgeAll ? "black" : "red"),
    (gSearchForm.lotsizelow.style.color =
      gSearchForm.lotsizelow.value == kLotSizesAll ? "black" : "red"),
    (gSearchForm.lotsizehigh.style.color =
      gSearchForm.lotsizehigh.value == kLotSizesAll ? "black" : "red"),
    (gSearchForm.parkinginfo.style.color =
      gSearchForm.parkinginfo.value == kParkingAll ? "black" : "red");
}
function doSearch(e, t) {
  colorizeSearchForm(), getProperties(e, t);
}
function getSortPopup() {
  var e,
    t = "";
  for (e of ((t += "Sort"),
  (t += "&nbsp;"),
  (t +=
    "<select id='sort' onchange='gSortOrder = parseInt(this.value, 10); savePreferences(); doSearch(1, false);'>"),
  [
    { value: 0, name: "Price (low to high)" },
    { value: 1, name: "Price (high to low)" },
    { value: 23, name: "Price Change % (low to high)" },
    { value: 24, name: "Price Change % (high to low)" },
    { value: 13, name: "Price per SqFt (low to high)" },
    { value: 14, name: "Price per SqFt (high to low)" },
    { value: 2, name: "Days on Market (low to high)" },
    { value: 3, name: "Days on Market (high to low)" },
    { value: 19, name: "Days at Current Price (low to high)" },
    { value: 20, name: "Days at Current Price (high to low)" },
    { value: 12, name: "Price Changed Date (recent first)" },
    { value: 4, name: "House Size (low to high)" },
    { value: 5, name: "House Size (high to low)" },
    { value: 6, name: "House Age (low to high)" },
    { value: 7, name: "House Age (high to low)" },
    { value: 8, name: "Lot Size (low to high)" },
    { value: 9, name: "Lot Size (high to low)" },
    { value: 25, name: "Maintenance Fee (low to high)" },
  ]))
    t +=
      "<option value='" +
      e.value +
      "'" +
      (gSortOrder == e.value ? " selected" : "") +
      ">" +
      e.name +
      "</option>";
  for (e of [
    { value: 17, name: "Price:Assessment Ratio (low to high)" },
    { value: 18, name: "Price:Assessment Ratio (high to low)" },
  ])
    t +=
      "<option value='" +
      e.value +
      "'" +
      (gSortOrder == e.value ? " selected" : "") +
      ">" +
      e.name +
      "</option>";
  if (gSoldFlag && gUserName)
    for (e of ((t += "<option value='' disabled></option>"),
    [
      { value: 10, name: "Sale Date (recent first)" },
      { value: 16, name: "Sale Date (oldest first)" },
      { value: 11, name: "Sale Reported Date (recent first)" },
      { value: 15, name: "Sale Reported Date (oldest first)" },
      { value: 21, name: "Sale Price:Ask Price (high to low)" },
      { value: 22, name: "Sale Price:Ask Price (low to high)" },
    ]))
      t +=
        "<option value='" +
        e.value +
        "'" +
        (gSortOrder == e.value ? " selected" : "") +
        ">" +
        e.name +
        "</option>";
  if (gExpiredFlag && gUserName)
    for (e of ((t += "<option value='' disabled></option>"),
    [
      { value: 11, name: "Off Market Date (recent first)" },
      { value: 15, name: "Off Market Date (oldest first)" },
    ]))
      t +=
        "<option value='" +
        e.value +
        "'" +
        (gSortOrder == e.value ? " selected" : "") +
        ">" +
        e.name +
        "</option>";
  return t + "</select>";
}
function getSortOrderParm() {
  var e = " ORDER BY ";
  switch (gSortOrder) {
    case 0:
      gSoldFlag ? (e += "soldPrice ASC") : (e += "listingPrice ASC");
      break;
    case 1:
      gSoldFlag ? (e += "soldPrice DESC") : (e += "listingPrice DESC");
      break;
    case 2:
      gSoldFlag
        ? (e += "(soldDate - listingDate) ASC")
        : gExpiredFlag
        ? (e += "(entryDate - listingDate) ASC")
        : (e += "entryDate DESC");
      break;
    case 3:
      gSoldFlag
        ? (e += "(soldDate - listingDate) DESC")
        : gExpiredFlag
        ? (e += "(entryDate - listingDate) DESC")
        : (e += "entryDate ASC");
      break;
    case 4:
      e += "houseSize ASC";
      break;
    case 5:
      e += "houseSize DESC";
      break;
    case 6:
      e += "houseAge ASC";
      break;
    case 7:
      e += "houseAge DESC";
      break;
    case 8:
      e += "lotSize ASC";
      break;
    case 9:
      e += "lotSize DESC";
      break;
    case 10:
      e += "soldDate DESC";
      break;
    case 11:
      e += "entryDate DESC";
      break;
    case 12:
      e += "listingPricePrevDate DESC";
      break;
    case 13:
      e += "(listingPrice / houseSize) ASC";
      break;
    case 14:
      e += "(listingPrice / houseSize) DESC";
      break;
    case 15:
      e += "entryDate ASC";
      break;
    case 16:
      e += "soldDate ASC";
      break;
    case 17:
      e +=
        "CASE WHEN askToAssessed = 0 THEN -1 ELSE 0 END DESC, CASE WHEN askToAssessed <> 0 THEN askToAssessed END ASC";
      break;
    case 18:
      e +=
        "CASE WHEN askToAssessed = 0 THEN -1 ELSE 0 END DESC, CASE WHEN askToAssessed <> 0 THEN askToAssessed END DESC";
      break;
    case 19:
      gSoldFlag
        ? (e += "(soldDate - listingDate) ASC")
        : (e += "GREATEST(entryDate, listingPricePrevDate) DESC");
      break;
    case 20:
      gSoldFlag
        ? (e += "(soldDate - listingDate) DESC")
        : (e += "GREATEST(entryDate, listingPricePrevDate) ASC");
      break;
    case 21:
      e += "(soldPrice / listingPrice) DESC";
      break;
    case 22:
      e += "(soldPrice / listingPrice) ASC";
      break;
    case 23:
      e +=
        "CASE WHEN listingPricePrev = 0 THEN -1 ELSE 0 END DESC, CASE WHEN listingPricePrev > 0 THEN (listingPrice - listingPricePrev) / listingPricePrev ELSE (listingPrice - listingPriceOrig) / listingPriceOrig END ASC";
      break;
    case 24:
      e +=
        "CASE WHEN listingPricePrev = 0 THEN -1 ELSE 0 END DESC, CASE WHEN listingPricePrev > 0 THEN (listingPrice - listingPricePrev) / listingPricePrev ELSE (listingPrice - listingPriceOrig) / listingPriceOrig END DESC";
      break;
    case 25:
      e +=
        "CASE WHEN strataFees = 0 THEN -1 ELSE 0 END DESC, CASE WHEN strataFees > 0 THEN strataFees END ASC";
  }
  return e;
}
function savePreferences() {
  var e = "";
  gUserName &&
    ((e += kLastTypesCookie + "	" + gTypeMenuValue.join(",") + "\n"),
    (e += kFavoritesCookie + "	" + gFavoritesList.join(",") + "\n"),
    (e += kRejectedCookie + "	" + gRejectedList.join(",") + "\n"),
    (e += kCompactListCookie + "	" + (gTableListFlag ? "1" : "") + "\n"),
    (e += kSearchFormListCookie + "	" + (gSearchFormHidden ? "1" : "") + "\n"),
    userSetAll(
      (e +=
        (gSoldFlag
          ? kOrderSoldListCookie
          : gExpiredFlag
          ? kOrderExpiredListCookie
          : kOrderListCookie) +
        "	" +
        gSortOrder +
        "\n")
    ));
}
function getIndexFromID(e) {
  var t,
    o = -1;
  if (e) {
    for (t = 0, e = e.trim().toLowerCase(); t < propertyDB.length; t++)
      if (e == propertyDB[t].theMLSnumber.toLowerCase()) {
        o = t;
        break;
      }
  }
  return o;
}
function formatPrice(e) {
  for (var t = "", o = parseInt(1e3 * e, 10).toString(); o.length > 3; )
    (t = "," + o.substring(o.length - 3) + t),
      (o = o.substring(0, o.length - 3));
  return "$" + (t = o + t);
}
function formatPriceShort(e) {
  var t;
  return (
    "$" +
    (t =
      e >= 1e9
        ? round(e / 1e9, 2) + "B"
        : e >= 1e6
        ? round(e / 1e6, 2) + "M"
        : e >= 1e4
        ? round(e / 1e3, 0) + "K"
        : round(e / 1e3, 1) + "K")
  );
}
function formatNumber(e) {
  for (var t = "", o = e.toString().split("."), r = o[0]; r.length > 3; )
    (t = "," + r.substring(r.length - 3) + t),
      (r = r.substring(0, r.length - 3));
  return (
    (t = r + t),
    2 == o.length && (t += "." + o[1] + (1 == o[1].length ? "0" : "")),
    t
  );
}
function round(e, t) {
  var o = Math.pow(10, t);
  return (Math.round(e * o) / o).toFixed(t);
}
function userIsPrivileged() {
  var e,
    t,
    o = !1;
  return (
    gUserName &&
      ((e = gUserName.toLowerCase()),
      (t =
        "" == kUsersPrivileged
          ? []
          : kUsersPrivileged.toLowerCase().replace(/\s/g, "").split(",")),
      userIsOwner() ? (o = !0) : in_array(e, t) && (o = !0)),
    o
  );
}
function userIsOwner() {
  var e = !1;
  return (
    gUserName &&
      in_array(gUserName.toLowerCase(), [
        kAgentEmail.toLowerCase(),
        kAgentEmailAlternate.toLowerCase(),
      ]) &&
      (e = !0),
    e
  );
}
function showStrataInfo(e, t) {
  var o = document.createElement("a"),
    r = t;
  (r = (r = (r = (r = (r = r.replace(/# /, "")).replace(/#/, "")).replace(
    /\//g,
    "-"
  )).replace(/'/g, "%27")).replace(/ /g, "-")),
    (o.target = "_blank"),
    (o.href =
      kSheetServer +
      "strata-" +
      e +
      "/" +
      r +
      "/" +
      (userIsPrivileged() ? gUserName : "")),
    o.click();
}
function showDataSheet(e, t, o) {
  var r = document.createElement("a"),
    a = propertyDB[getIndexFromID(e)],
    i = a.theStreetAddress,
    l = a.theTown,
    n = a.theCity;
  (i += " " + ("" == n ? l : n) + " " + a.theProvince),
    (i = (i = (i = (i = (i = i.replace(/# /, "")).replace(/#/, "")).replace(
      /\//g,
      "-"
    )).replace(/'/g, "%27")).replace(/ /g, "-")),
    (r.target = "_blank"),
    (r.href =
      kSheetServer +
      "mls-" +
      a.theMLSnumber +
      "/" +
      i +
      "/" +
      (userIsPrivileged() ? gUserName : "")),
    r.click();
}
function getTwitterButton(e) {
  var t,
    o,
    r,
    a,
    i,
    l = propertyDB[getIndexFromID(e)],
    n = l.theStreetAddress,
    s = l.theTown,
    d = l.theCity,
    g = l.thePrice,
    h = "",
    c = Math.max((getWindowWidth() - 550) / 2, 0);
  return (
    (n += " " + ("" == d ? s : d)),
    (n = (n = (n = (n = (n = n.replace(/# /, "")).replace(/#/, "")).replace(
      /\//g,
      "-"
    )).replace(/'/g, "%27")).replace(/ /g, "-")),
    (t = (t =
      "For Sale " +
      formatPrice(g) +
      " at " +
      l.theStreetAddress +
      " in " +
      ("" == d ? s : d)).replace(/#/g, "")),
    (a = kSheetServer + "mls-" + l.theMLSnumber + "/" + n + "/"),
    (o = ""),
    (r = "false"),
    (i = "https://twitter.com/intent/tweet"),
    (i += "?text=" + encodeURIComponent(t)),
    (i += "&url=" + encodeURIComponent(a)),
    (i += "&hashtags=" + encodeURIComponent(o)),
    (i += "&show-count=" + encodeURIComponent(r)),
    (h += "<a href='javascript:window.open(\"" + i + '"'),
    (h +=
      ', "_blank", "width=550,height=450,left=' +
      c +
      ",top=110\"); void(0);'>"),
    (h +=
      "<div class='zealty-transition' style='display: inline; font-size: xx-large; color: #1D8DEE;' onmouseover='this.style.color=\"red\";' onmouseout='this.style.color=\"inherit\";' title=' Send a tweet '>"),
    (h += "<i class='fab fa-twitter-square'></i>"),
    (h += "</div>"),
    (h += "</a>")
  );
}
function getFacebookButton(e) {
  var t,
    o = propertyDB[getIndexFromID(e)],
    r = o.theStreetAddress,
    a = o.theTown,
    i = o.theCity;
  o.thePrice;
  var l = "";
  return (
    getWindowWidth(),
    (r += " " + ("" == i ? a : i)),
    (r = (r = (r = (r = (r = r.replace(/# /, "")).replace(/#/, "")).replace(
      /\//g,
      "-"
    )).replace(/'/g, "%27")).replace(/ /g, "-")),
    (t = kSheetServer + "mls-" + o.theMLSnumber + "/" + r + "/"),
    (l +=
      "<a href='javascript:window.open(\"http://www.facebook.com/sharer/sharer.php"),
    (l += "?u=" + encodeURIComponent(t)),
    (l += "\");'>"),
    (l +=
      "<div class='zealty-transition' style='display: inline; font-size: xx-large; color: #3351A2;' onmouseover='this.style.color=\"red\";' onmouseout='this.style.color=\"inherit\";' title=' Share on Facebook '>"),
    (l += "<i class='fab fa-facebook-square'></i>"),
    (l += "</div>"),
    (l += "</a>")
  );
}
function getProperties(e, t) {
  var o,
    r,
    a,
    i,
    l,
    n,
    s,
    d,
    g,
    h,
    c,
    u,
    p,
    m,
    y,
    v,
    f,
    S,
    b,
    _,
    k,
    $,
    w,
    D,
    T,
    F,
    A,
    E,
    P,
    x,
    C,
    L,
    R = gSearchForm.elements,
    B = gTypeMenuValue.join(","),
    I = R.excludeLeases.checked,
    N = R.town.value,
    O = R.status.value,
    z = R.ageactive.value,
    H = R.agePriceChangeFilter.value,
    W = R.agesold.value,
    V = R.pricelow.value,
    j = R.pricehigh.value,
    K = R.bedrooms.value,
    Y = R.bathrooms.value,
    U = R.housesizelow.value,
    q = R.housesizehigh.value,
    G = R.houseage.value,
    Z = R.lotsizelow.value * kSquareFeetPerSquareMeter,
    Q = R.lotsizehigh.value * kSquareFeetPerSquareMeter,
    X = R.parkinginfo.value,
    J = R.waterfront.checked,
    ee = R.view.checked,
    et = R.fireplace.checked,
    eo = R.pool.checked,
    er = R.workshop.checked,
    ea = R.suite.checked,
    ei = R.favorite.checked,
    el = R.rejected.checked,
    en = R.openhouse.checked,
    es = R.openhouseday.value,
    ed = R.foreclosure.checked,
    eg = R.virtualtour.checked,
    eh = R.query.value.trim();
  if (((i = []), el))
    i.push("(mlsNumber IN ('" + gRejectedList.join("','") + "'))");
  else {
    if (("" != eh && i.push(getKeywordSearchSQL(eh)), B != kPropertyAll)) {
      for (D of ((w = (w = B.split(",")).map(function (e) {
        return e.trim();
      })),
      (a = 0),
      w))
        D.startsWith("APT-") && a++;
      for (D of ((l = []), w))
        D.startsWith("APT")
          ? "" == (f = D.substring(4))
            ? l.push(
                "(propertyClassCode = " + kREA + " AND type = 'Apartment')"
              )
            : "Pets" == f
            ? (1 == a &&
                l.push(
                  "(propertyClassCode = " + kREA + " AND type = 'Apartment')"
                ),
              i.push(
                "(strataRules LIKE '%Pets Allowed%' OR siteInfluences LIKE '%Pets Allowed%')"
              ))
            : l.push(
                "(propertyClassCode = " +
                  kREA +
                  " AND type = 'Apartment' AND style LIKE '%" +
                  f +
                  "%')"
              )
          : "TWN" == D
          ? l.push("(propertyClassCode = " + kREA + " AND type <> 'Apartment')")
          : "TWN-No Duplexes" == D
          ? l.push(
              "(propertyClassCode = " +
                kREA +
                " AND type NOT IN ('Apartment', '1/2 Duplex', 'Duplex'))"
            )
          : "TWN-Only Duplexes" == D
          ? l.push("(type IN ('1/2 Duplex', 'Duplex'))")
          : "HSE" == D
          ? l.push("(propertyClassCode = " + kRED + ")")
          : "PAD" == D
          ? l.push("(propertyClassCode = " + kPAD + ")")
          : "MUF" == D
          ? l.push("(propertyClassCode = " + kMUF + ")")
          : "LND" == D
          ? l.push("(propertyClassCode = " + kLND + ")")
          : "COM" == D && l.push("(propertyClassCode = " + kCOM + ")");
      i.push("(" + l.join(" OR ") + ")");
    }
    if (
      (I &&
        i.push(
          "(title NOT REGEXP 'lease|co-op|time share|timeshare|undivided')"
        ),
      N != kTownEverywhereCode &&
        i.push("(areaName = '" + N.replace("'", "''") + "')"),
      "active" != O
        ? ("sold" == O
            ? (V > kPriceLowest && i.push("ABS(soldPrice) >= " + V),
              j != kPriceHighest && i.push("ABS(soldPrice) <= " + j),
              (T = W))
            : (V > kPriceLowest && i.push("listingPrice >= " + V),
              j != kPriceHighest && i.push("listingPrice <= " + j),
              (T = W)),
          ($ = (S = new Date()).getDate() - 1),
          2 ==
          (m = (m =
            "today" == T
              ? "0-0"
              : "yesterday" == T
              ? "1-1"
              : "this-year" == T
              ? "0-" +
                (k =
                  Math.round(
                    (S.setHours(23) -
                      new Date(S.getFullYear(), 0, 1, 0, 0, 0)) /
                      kMillisecondsPerDay
                  ) - 1)
              : "last-year" == T
              ? (v = Math.floor(
                  (S.getTime() - new Date(S.getFullYear(), 0, 1).getTime()) /
                    kMillisecondsPerDay
                )) +
                "-" +
                (y = Math.floor(
                  (S.getTime() -
                    new Date(S.getFullYear() - 1, 0, 1).getTime()) /
                    kMillisecondsPerDay
                ))
              : "last-month" == T
              ? getDateRange(
                  (S = new Date(
                    S.getFullYear(),
                    S.getMonth() - 1
                  )).getFullYear() +
                    "-" +
                    (S.getMonth() + 1)
                )
              : "this-month" == T
              ? "0-" + $
              : "this-month-last-year" == T
              ? getDateRange(
                  (S = new Date(
                    S.getFullYear(),
                    S.getMonth() - 12
                  )).getFullYear() +
                    "-" +
                    (S.getMonth() + 1)
                )
              : "last-month-last-year" == T
              ? getDateRange(
                  (S = new Date(
                    S.getFullYear(),
                    S.getMonth() - 13
                  )).getFullYear() +
                    "-" +
                    (S.getMonth() + 1)
                )
              : T).split("-")).length
            ? ((v = parseInt(m[0], 10)), (y = parseInt(m[1], 10)))
            : ((v = 0), (y = parseInt(T, 10))),
          (b = new Date()).setDate(b.getDate() - y),
          (_ = new Date()).setDate(_.getDate() - v),
          (b = b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()),
          (_ = _.getFullYear() + "-" + (_.getMonth() + 1) + "-" + _.getDate()),
          i.push("(entryDate BETWEEN '" + b + "' AND '" + _ + "')"))
        : (V > kPriceLowest && i.push("listingPrice >= " + V),
          j != kPriceHighest && i.push("listingPrice <= " + j),
          z != kAgeAll &&
            (($ = (S = new Date()).getDate() - 1),
            2 ==
            (m = (m =
              "today" == z
                ? "0-0"
                : "yesterday" == z
                ? "1-1"
                : "this-year" == z
                ? "0-" +
                  (k =
                    Math.round(
                      (S.setHours(23) -
                        new Date(S.getFullYear(), 0, 1, 0, 0, 0)) /
                        kMillisecondsPerDay
                    ) - 1)
                : "last-year" == z
                ? (v = Math.floor(
                    (S.getTime() - new Date(S.getFullYear(), 0, 1).getTime()) /
                      kMillisecondsPerDay
                  )) +
                  "-" +
                  (y = Math.floor(
                    (S.getTime() -
                      new Date(S.getFullYear() - 1, 0, 1).getTime()) /
                      kMillisecondsPerDay
                  ))
                : "last-month" == z
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 1
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : "this-month" == z
                ? "0-" + $
                : "this-month-last-year" == z
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 12
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : "last-month-last-year" == z
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 13
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : z.endsWith("+")
                ? parseInt(z, 10) + "-0"
                : z).split("-")).length
              ? ((v = parseInt(m[0], 10)), (y = parseInt(m[1], 10)))
              : ((v = 0), (y = parseInt(z, 10))),
            (b = new Date()).setDate(b.getDate() - y),
            (_ = new Date()).setDate(_.getDate() - v),
            (b =
              b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()),
            (_ =
              _.getFullYear() + "-" + (_.getMonth() + 1) + "-" + _.getDate()),
            "today" != z && 0 == y
              ? i.push("(entryDate <= '" + _ + "')")
              : i.push("(entryDate BETWEEN '" + b + "' AND '" + _ + "')")),
          H != kAgeAll &&
            (($ = (S = new Date()).getDate() - 1),
            2 ==
            (m = (m =
              "today" == H
                ? "0-0"
                : "yesterday" == H
                ? "1-1"
                : "this-year" == H
                ? "0-" +
                  (k =
                    Math.round(
                      (S.setHours(23) -
                        new Date(S.getFullYear(), 0, 1, 0, 0, 0)) /
                        kMillisecondsPerDay
                    ) - 1)
                : "last-year" == H
                ? (v = Math.floor(
                    (S.getTime() - new Date(S.getFullYear(), 0, 1).getTime()) /
                      kMillisecondsPerDay
                  )) +
                  "-" +
                  (y = Math.floor(
                    (S.getTime() -
                      new Date(S.getFullYear() - 1, 0, 1).getTime()) /
                      kMillisecondsPerDay
                  ))
                : "last-month" == H
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 1
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : "this-month" == H
                ? "0-" + $
                : "this-month-last-year" == H
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 12
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : "last-month-last-year" == H
                ? getDateRange(
                    (S = new Date(
                      S.getFullYear(),
                      S.getMonth() - 13
                    )).getFullYear() +
                      "-" +
                      (S.getMonth() + 1)
                  )
                : H.endsWith("+")
                ? parseInt(H, 10) + "-0"
                : H).split("-")).length
              ? ((v = parseInt(m[0], 10)), (y = parseInt(m[1], 10)))
              : ((v = 0), (y = parseInt(H, 10))),
            (b = new Date()).setDate(b.getDate() - y),
            (_ = new Date()).setDate(_.getDate() - v),
            (b =
              b.getFullYear() + "-" + (b.getMonth() + 1) + "-" + b.getDate()),
            (_ =
              _.getFullYear() + "-" + (_.getMonth() + 1) + "-" + _.getDate()),
            "today" != H && 0 == y
              ? (i.push("(listingPricePrevDate <= '" + _ + "')"),
                i.push("listingPricePrev <> listingPrice"))
              : (i.push(
                  "(listingPricePrevDate BETWEEN '" + b + "' AND '" + _ + "')"
                ),
                i.push("listingPricePrev <> listingPrice")))),
      K > 0 && i.push("bedroomCount >= " + K),
      Y > 0 && i.push("bathroomCount >= " + Y),
      U > 0 && i.push("houseSize >= " + U),
      q > 0 && i.push("houseSize <= " + q),
      G != kHouseAgeAll &&
        ((F = G.split("-")).length > 1
          ? ((A = parseInt(F[0], 10)),
            (E = parseInt(F[1], 10)),
            (P = parseInt(new Date().getFullYear(), 10)),
            "active" != O
              ? i.push(
                  "((houseAge BETWEEN (" +
                    (A - P) +
                    " + YEAR(entryDate)) AND (" +
                    (E - P) +
                    " + YEAR(entryDate))) AND propertyClassCode <> " +
                    kLND +
                    ")"
                )
              : i.push(
                  "((houseAge BETWEEN " +
                    A +
                    " AND " +
                    E +
                    ") AND propertyClassCode <> " +
                    kLND +
                    ")"
                ))
          : i.push(
              "(houseAge <= " + G + " AND propertyClassCode <> " + kLND + ")"
            )),
      Z > 0 && i.push("lotSize >= " + Z),
      Q > 0 && i.push("lotSize <= " + Q),
      X != kParkingAll && i.push("parkingInfo LIKE '%" + X + "%'"),
      J && i.push("siteInfluences LIKE '%waterfront%'"),
      ee && i.push("siteInfluences LIKE '%view%'"),
      et && i.push("siteInfluences LIKE '%fireplace%'"),
      eo && i.push("siteInfluences LIKE '%pool%'"),
      er && i.push("siteInfluences LIKE '%workshop%'"),
      ea && i.push("suite NOT IN ('', 'None')"),
      ei && i.push("mlsNumber IN ('" + gFavoritesList.join("','") + "')"),
      en)
    ) {
      if ("all" == es) i.push("openHouse <> ''");
      else {
        switch (es) {
          case "saturday":
            es = 6;
            break;
          case "sunday":
            es = 0;
            break;
          case "today":
            es = -1;
        }
        (u = getDateOfNextWeekday(es)),
          i.push(
            "openHouse LIKE '%" +
              kMonthNamesFull[u.getMonth()] +
              " " +
              u.getDate() +
              "%'"
          );
      }
    }
    ed && i.push("foreclosureFlag <> ''"),
      eg && i.push("virtualTourURL <> ''"),
      in_array(gSortOrder, [17, 18]) &&
        i.push("(assessmentLand > 0 OR assessmentBldg > 0)"),
      "" == gUserName && i.push("reciprocityOK = 0"),
      gAgentList &&
        ((n = []),
        (d = (d = (d = gAgentList.replace(/'/g, "''")).split(",")).map(
          function (e) {
            return e.trim();
          }
        )),
        n.push("(listingAgent IN ('" + d.join("','") + "'))"),
        n.push("(listingAgent2 IN ('" + d.join("','") + "'))"),
        n.push("(listingAgent3 IN ('" + d.join("','") + "'))"),
        i.push("(" + n.join(" OR ") + ")")),
      gAgentBuy &&
        ((n = []),
        (d = (d = (d = gAgentBuy.replace(/'/g, "''")).split(",")).map(function (
          e
        ) {
          return e.trim();
        })),
        n.push("(sellingAgent IN ('" + d.join("','") + "'))"),
        n.push("(sellingAgent2 IN ('" + d.join("','") + "'))"),
        n.push("(sellingAgent3 IN ('" + d.join("','") + "'))"),
        i.push("(" + n.join(" OR ") + ")")),
      gAgentDeal &&
        ((n = []),
        (d = (d = (d = gAgentDeal.replace(/'/g, "''")).split(",")).map(
          function (e) {
            return e.trim();
          }
        )),
        n.push("(listingAgent IN ('" + d.join("','") + "'))"),
        n.push("(listingAgent2 IN ('" + d.join("','") + "'))"),
        n.push("(listingAgent3 IN ('" + d.join("','") + "'))"),
        n.push("(sellingAgent IN ('" + d.join("','") + "'))"),
        n.push("(sellingAgent2 IN ('" + d.join("','") + "'))"),
        n.push("(sellingAgent3 IN ('" + d.join("','") + "'))"),
        i.push("(" + n.join(" OR ") + ")")),
      gBrokerageList &&
        ((s = []),
        (g = (g = (g = gBrokerageList.replace(/'/g, "''")).split(",")).map(
          function (e) {
            return e.trim();
          }
        )),
        s.push("(listingBrokerage IN ('" + g.join("','") + "'))"),
        s.push("(listingBrokerage2 IN ('" + g.join("','") + "'))"),
        s.push("(listingBrokerage3 IN ('" + g.join("','") + "'))"),
        i.push("(" + s.join(" OR ") + ")")),
      gBrokerageBuy &&
        ((s = []),
        (g = (g = (g = gBrokerageBuy.replace(/'/g, "''")).split(",")).map(
          function (e) {
            return e.trim();
          }
        )),
        s.push("(sellingBrokerage IN ('" + g.join("','") + "'))"),
        s.push("(sellingBrokerage2 IN ('" + g.join("','") + "'))"),
        s.push("(sellingBrokerage3 IN ('" + g.join("','") + "'))"),
        i.push("(" + s.join(" OR ") + ")")),
      gBrokerageDeal &&
        ((s = []),
        (g = (g = (g = gBrokerageDeal.replace(/'/g, "''")).split(",")).map(
          function (e) {
            return e.trim();
          }
        )),
        s.push("(listingBrokerage IN ('" + g.join("','") + "'))"),
        s.push("(listingBrokerage2 IN ('" + g.join("','") + "'))"),
        s.push("(listingBrokerage3 IN ('" + g.join("','") + "'))"),
        s.push("(sellingBrokerage IN ('" + g.join("','") + "'))"),
        s.push("(sellingBrokerage2 IN ('" + g.join("','") + "'))"),
        s.push("(sellingBrokerage3 IN ('" + g.join("','") + "'))"),
        i.push("(" + s.join(" OR ") + ")")),
      in_array(kMapName, ["all", "allBC"]) && i.push("(province = 'BC')");
  }
  if (
    (kRegionNames.length > 0 &&
      i.push("regionName IN ('" + kRegionNames.join("','") + "')"),
    (propertyDB = []),
    ei && 0 == gFavoritesList.length)
  ) {
    showFoundList(1, !1);
    return;
  }
  1 == e &&
    ((r =
      "sql=" +
      encodeURIComponent(
        (h =
          "SELECT COUNT(*) FROM ***" +
          (i.length > 0 ? " WHERE " + i.join(" AND ") : "") +
          " LIMIT 1")
      )),
    (r += "&sold=" + O),
    (r += "&s=" + gReceiver_(h)),
    (o = new XMLHttpRequest()).open("POST", kQuerySQL, !1),
    o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
    o.send(r),
    200 == o.status &&
      (x = o.responseText) &&
      (C = JSON.parse(x)) &&
      C.rows &&
      ((gTotalCount = C.rows[0][0]),
      (gPageCount =
        parseInt(
          (L =
            "" == gUserName || userIsPrivileged()
              ? gTotalCount
              : Math.min(gTotalCount, kVOWlimit)) / kPageSize,
          10
        ) + (L % kPageSize > 0 ? 1 : 0)))),
    (p = getSortOrderParm()),
    (c =
      "SELECT * FROM ***" +
      (i.length > 0 ? " WHERE " + i.join(" AND ") : "") +
      p),
    (c += " LIMIT " + kPageSize + " OFFSET " + (e - 1) * kPageSize),
    (r = "sql=" + encodeURIComponent(c)),
    (r += "&sold=" + O),
    (r += "&s=" + gReceiver_(c));
  try {
    (document.getElementById(kSpinnerID).style.display = "inline-block"),
      (o = new XMLHttpRequest()).open("POST", kQuerySQL, !0),
      o.setRequestHeader("Content-Type", "application/x-www-form-urlencoded"),
      (o.onreadystatechange = function () {
        var r, a, i, l;
        try {
          if (o.readyState == XMLHttpRequest.DONE) {
            if (200 == o.status) {
              if ((r = o.responseText) && (a = JSON.parse(r)) && a.rows) {
                for (i of a.rows)
                  propertyDB.push(makePropertyRecord(i)),
                    (l = i[0]),
                    in_array(l, gFavoritesList) &&
                      (propertyDB[propertyDB.length - 1].isMarked = !0);
                showSummary(), showFoundList(e, t);
              }
            } else
              throw { message: "Unexpected HTTP error (" + o.status + ")" };
          }
        } catch (n) {
          alert("Problem loading properties (2): " + n.message);
        } finally {
          document.getElementById(kSpinnerID).style.display = "none";
        }
      }),
      o.send(r);
  } catch (ec) {
    alert("Problem loading properties (1): " + ec.message);
  }
}
function getKeywordSearchSQL(e) {
  var t, o;
  for (getKeywordsAndOrNot(e), o = "", t = 0; t < gAndWords.length; t++)
    (o += 0 == t ? "(" : " AND "),
      (o += "("),
      (o += "(mlsNumber RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(streetAddress RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(description RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(areaName RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(city RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(postalCode RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(condoName RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(siteInfluences RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(suite RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(strataRules RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(zoning RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(province RLIKE '[[:<:]]" + gAndWords[t] + "[[:>:]]')"),
      (o += ")"),
      t == gAndWords.length - 1 && (o += ")");
  for (t = 0; t < gOrWords.length; t++)
    0 == t ? (o ? (o += " AND (") : (o += "(")) : (o += " OR "),
      (o += "("),
      (o += "(mlsNumber RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(streetAddress RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(description RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(areaName RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(city RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(postalCode RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(condoName RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(siteInfluences RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(suite RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(strataRules RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(zoning RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(province RLIKE '[[:<:]]" + gOrWords[t] + "[[:>:]]')"),
      (o += ")"),
      t == gOrWords.length - 1 && (o += ")");
  for (t = 0; t < gNotWords.length; t++)
    o ? (o += " AND NOT ") : (o += "NOT "),
      (o += "("),
      (o += "(mlsNumber RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(streetAddress RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(description RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(areaName RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(city RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(postalCode RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(condoName RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(siteInfluences RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(suite RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(strataRules RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(zoning RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += " OR "),
      (o += "(province RLIKE '[[:<:]]" + gNotWords[t] + "[[:>:]]')"),
      (o += ")");
  return o;
}
function getKeywordsAndOrNot(e) {
  var t, o, r, a, i, l, n, s, d;
  for (
    t = 0,
      gAndWords = [],
      gOrWords = [],
      gNotWords = [],
      r = !1,
      a = !1,
      i = !1,
      l = !1,
      s = 0;
    t < e.length;
    t++
  )
    (o = e.substring(t, t + 1)),
      r
        ? '"' == o &&
          ((r = !1), gAndWords.push(e.substring(s, t)), (t = (s = g(e, t)) - 1))
        : a
        ? ")" == o
          ? ((a = !1),
            (i = !1),
            t > s && gOrWords.push(e.substring(s, t)),
            (t = (s = g(e, t)) - 1))
          : '"' == o
          ? i
            ? (gOrWords.push(e.substring(s, t)),
              (i = !1),
              (t = (s = g(e, t)) - 1))
            : ((t = (s = t + 1) - 1), (i = !0))
          : i ||
            (" " != o && "," != o) ||
            (gOrWords.push(e.substring(s, t)),
            (t = (s = g(e, t)) - 1),
            (i = !1))
        : '"' == o
        ? ((r = !0), (t = (s = t + 1) - 1))
        : "(" == o
        ? ((a = !0), (t = (s = g(e, t)) - 1))
        : "-" == o &&
          (0 == t ||
            " " == e.substring(t - 1, t) ||
            "," == e.substring(t - 1, t))
        ? ((l = !0), (t = (s = g(e, t)) - 1))
        : (" " == o || "," == o) &&
          ((o = (n = e.substring(s, t)).substring(t, t + 1)),
          l ? (gNotWords.push(n), (l = !1)) : gAndWords.push(n),
          (t = (s = g(e, t)) - 1));
  function g(e, t) {
    var o, r;
    for (
      o = t + 1;
      o < e.length && (" " == (r = e.substring(o, o + 1)) || "," == r);
      o++
    );
    return o;
  }
  (d = e.substring(s, e.length)),
    r
      ? gAndWords.push(d)
      : a
      ? gOrWords.push(d)
      : l
      ? gNotWords.push(d)
      : s < e.length && gAndWords.push(d),
    (gAndWords = gAndWords.map(function (e) {
      return e.replace(/'/g, "''");
    })),
    (gOrWords = gOrWords.map(function (e) {
      return e.replace(/'/g, "''");
    })),
    (gNotWords = gNotWords.map(function (e) {
      return e.replace(/'/g, "''");
    }));
}
function showSummary() {
  var e,
    t = gSearchForm.status.value,
    o = gTypeMenuValue.join(",");
  o == kTypeMenuValuesResidential.join(",")
    ? (o = kTypeMenuTitleResidential)
    : o == kTypeMenuValuesCommercial.join(",")
    ? (o = kTypeMenuTitleCommercial)
    : o == kTypeMenuValuesAll.join(",") && (o = kTypeMenuTitleAll),
    "active" == t && (t = "for sale"),
    (e = formatNumber(gTotalCount) + " found"),
    gSearchFormHidden &&
      (e +=
        " &bull; " +
        o +
        "<br>" +
        t +
        ("for sale" == t ? "; listed" : "") +
        " " +
        ("for sale" == t
          ? gSearchForm.ageactive.options[gSearchForm.ageactive.selectedIndex]
              .text
          : gSearchForm.agesold.options[gSearchForm.agesold.selectedIndex]
              .text) +
        (gSearchForm.query.value
          ? " &bull; Keyword: &ldquo;" + gSearchForm.query.value + "&rdquo;"
          : "")),
    (document.getElementById(kQuickSummaryID).innerHTML = e);
}
function makePropertyRecord(e) {
  return (
    (e[1] = parseFloat(e[1])),
    (e[2] = parseFloat(e[2])),
    (e[7] = parseFloat(e[7])),
    (e[11] = parseInt(e[11], 10)),
    (e[12] = parseInt(e[12], 10)),
    (e[13] = parseFloat(e[13])),
    (e[14] = parseInt(e[14], 10)),
    (e[25] = parseFloat(e[25])),
    (e[27] = parseFloat(e[27])),
    (e[28] = parseFloat(e[28])),
    (e[29] = parseInt(e[29], 10)),
    (e[32] = parseFloat(e[32])),
    (e[37] = parseInt(e[37], 10)),
    (e[39] = parseInt(e[39], 10)),
    (e[43] = parseFloat(e[43])),
    (e[82] = parseFloat(e[82])),
    (e[83] = parseFloat(e[83])),
    (e[88] = parseInt(e[88], 10)),
    (e[143] = parseInt(e[143], 10)),
    (e[89] = parseInt(e[89], 10)),
    (e[90] = parseInt(e[90], 10)),
    (e[91] = parseInt(e[91], 10)),
    (e[92] = parseInt(e[92], 10)),
    (e[93] = parseInt(e[93], 10)),
    (e[94] = parseFloat(e[94], 10)),
    (e[108] = parseFloat(e[108])),
    (e[109] = parseFloat(e[109])),
    (e[110] = parseFloat(e[110])),
    (e[121] = parseInt(e[121], 10)),
    (e[144] = parseInt(e[144], 10)),
    M(
      e[0],
      e[3],
      e[34],
      e[1],
      e[2],
      e[5],
      e[4],
      e[6],
      e[7],
      e[25],
      e[26],
      e[27],
      e[38],
      e[24],
      e[9],
      e[10],
      e[8],
      e[21],
      e[22],
      e[23],
      e[20],
      e[11],
      e[14],
      e[12],
      e[13],
      e[15],
      e[16],
      e[29],
      e[30],
      e[31],
      e[32],
      e[33],
      e[36],
      e[37],
      e[40],
      e[43],
      e[35],
      e[44],
      e[45],
      e[46],
      e[47],
      e[48],
      e[49],
      e[50],
      e[51],
      e[52],
      e[53],
      e[54],
      e[55],
      e[56],
      e[57],
      e[58],
      e[59],
      e[60],
      e[61],
      e[62],
      e[63],
      e[64],
      e[65],
      e[66],
      e[67],
      e[68],
      e[69],
      e[70],
      e[71],
      e[72],
      e[73],
      e[74],
      e[75],
      e[76],
      e[77],
      e[78],
      e[79],
      e[80],
      e[81],
      e[82],
      e[83],
      e[84],
      e[85],
      e[86],
      e[87],
      e[88],
      e[143],
      e[89],
      e[90],
      e[91],
      e[92],
      e[93],
      e[94],
      e[95],
      e[96],
      e[97],
      e[98],
      e[99],
      e[100],
      e[101],
      e[102],
      e[103],
      e[104],
      e[105],
      e[107],
      e[108],
      e[109],
      e[110],
      e[111],
      e[112],
      e[113],
      e[114],
      e[115],
      e[116],
      e[117],
      e[118],
      e[119],
      e[120],
      e[39],
      e[121],
      e[106],
      e[17],
      e[18],
      e[124],
      e[134],
      e[42],
      e[136],
      e[28],
      e[118],
      e[135],
      e[123],
      e[122],
      e[19],
      e[138],
      e[139],
      e[140],
      e[144],
      e[148],
      e[141],
      e[126],
      e[127],
      e[128],
      e[129],
      e[130],
      e[131],
      e[132],
      e[133]
    )
  );
}
function getRegionInfo(e) {
  var t, o, r, a, i, l;
  for (r in ((document.getElementById("activeDaysPopup").style.display =
    gSoldFlag || gExpiredFlag ? "none" : "inline"),
  (document.getElementById("soldDaysPopup").style.display =
    gSoldFlag || gExpiredFlag ? "inline" : "none"),
  gSoldFlag
    ? (document.getElementById("soldDaysPopupTitle").innerHTML = "sold")
    : gExpiredFlag &&
      (document.getElementById("soldDaysPopupTitle").innerHTML = "expired"),
  (o = !0),
  kRegionsAndAreas))
    if (((a = kRegionsAndAreas[r]), r == e)) {
      (kRegionNames =
        "" == a.regionNames ? [] : a.regionNames.split(",").map(n)),
        (i = "" == a.areaValues ? [] : a.areaValues.split(",").map(n)),
        (l = "" == a.areaValuesMore ? [] : a.areaValuesMore.split(",").map(n)),
        (kAreaValues = i.concat(l)),
        (kPriceBands = a.priceBands.split(",").map(n)),
        (o = !1);
      break;
    }
  function n(e) {
    return e.trim();
  }
  o &&
    ((kRegionNames = []),
    (kAreaValues = []),
    (kPriceBands =
      "250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 3000, 4000, 5000, 7000, 10000, 15000, 20000"
        .split(",")
        .map(n))),
    kAreaValues.sort(),
    (t = (kAreaNames = kAreaValues.slice()).indexOf("Pender")) > -1 &&
      (kAreaNames[t] = "Pender Harbour"),
    kAreaValues.unshift(kTownEverywhereCode),
    kAreaNames.unshift(kTownEverywhereName);
}
function getDateRange(e) {
  var t,
    o,
    r,
    a = new Date().getTime(),
    i = e.split("-"),
    l = parseInt(i[0], 10),
    n = parseInt(i[1], 10);
  return (
    3 == i.length
      ? ((t = parseInt(i[2], 10)),
        (r = o =
          Math.floor(
            (a - new Date(l, n - 1, t).getTime()) / kMillisecondsPerDay
          )))
      : ((t = 1),
        (o = Math.floor(
          (a - new Date(l, n, 0).getTime()) / kMillisecondsPerDay
        )),
        (r = Math.floor(
          (a - new Date(l, n - 1, t).getTime()) / kMillisecondsPerDay
        )),
        o < 0 && (o = 0)),
    o + "-" + r
  );
}
function getIconURL(e, t, o, r, a, i, l) {
  var n,
    s = "white",
    d = kMarkerColorActive,
    g = 0 * kMarkerWidth,
    h = 0 * kMarkerHeight;
  return (
    in_array(e, [kCOM]) && ((d = "black"), (h = 1 * kMarkerHeight)),
    "S" == r
      ? ((d = kMarkerColorSold), (g = 3 * kMarkerWidth))
      : "A" != r
      ? ((d = kMarkerColorExpired), (g = 4 * kMarkerWidth))
      : t <= kRecentListingMaxAge
      ? ((s = "yellow"), (g = 2 * kMarkerWidth))
      : -1 != o &&
        o <= kRecentPriceChangeMaxAge &&
        ((s = "lime"), (g = 1 * kMarkerWidth)),
    a && (g += 5 * kMarkerWidth),
    (n = l
      ? "<svg width='24' height='24'><circle cx='12' cy='12' r='8' style='fill: " +
        d +
        "; stroke-width: 2; stroke: " +
        s +
        ";' /></svg>"
      : {
          url: kMarkersAllURL,
          anchor: new google.maps.Point(kMarkerAnchorX, kMarkerAnchorY),
          origin: new google.maps.Point(g, h),
          size: new google.maps.Size(kMarkerWidth, kMarkerHeight),
          scaledSize: new google.maps.Size(
            kMarkerWidthScaled,
            kMarkerHeightScaled
          ),
          labelOrigin: new google.maps.Point(
            kMarkerLabelOriginX,
            kMarkerLabelOriginY
          ),
        })
  );
}
function doPrint() {
  var e,
    t = document.getElementsByTagName("img");
  for (e of t) e.setAttribute("loading", "eager");
  setTimeout(function () {
    (document.getElementById("container").style.cssText = ""),
      window.print(),
      onWindowResize();
  }, 3e3);
}
function initLoginData() {
  var e, t, o, r, a, i, l, n, s;
  if (
    ((gFavoritesList = []),
    (gRejectedList = []),
    (gSortOrder = gSoldFlag ? kSortOrderSoldDefault : kSortOrderActiveDefault),
    (gTableListFlag = !1),
    (gSearchFormHidden = !1),
    (gShowRealtorName = !1),
    "" == gUserName)
  )
    for (t of propertyDB) t.isMarked = !1;
  else if (((o = []), null != (s = userGetAll()))) {
    for (r of (a = s.split(/[\n\r]+/)))
      "" != r &&
        ((e = r.indexOf("	")),
        (i = r.substring(0, e)),
        (l = r.substring(e + 1)),
        (o[i] = l));
    if (
      ((gRealName = o["real-name"]),
      ("" == (n = o[kFavoritesCookie]) || void 0 === n) && (n = ""),
      n)
    )
      for (t of ((gFavoritesList = (gFavoritesList = n.split(",")).filter(
        function (e, t) {
          return gFavoritesList.indexOf(e) == t;
        }
      )),
      propertyDB))
        t.isMarked = in_array(t.theMLSnumber, gFavoritesList);
    ("" == (n = o[kRejectedCookie]) || void 0 === n) && (n = ""),
      n && (gRejectedList = n.split(",")),
      "" == (n = gSoldFlag ? o[kOrderSoldListCookie] : o[kOrderListCookie]) ||
        void 0 === n ||
        isNaN(n) ||
        (gSortOrder = parseInt(n, 10)),
      (gShowRealtorName = "1" == (n = o[kRealtorCookie])),
      ("" == (n = o[kCompactListCookie]) || void 0 === n) && (n = ""),
      (gTableListFlag = "" != n),
      ("" == (n = o[kSearchFormListCookie]) || void 0 === n) && (n = ""),
      (gSearchFormHidden = n),
      void 0 === (n = o[kLastTypesCookie]) && (n = ""),
      (gTypeMenuValue = n.split(",")),
      typeMenuSet();
  }
  showSearchForm();
}
function showSearchForm() {
  (document.getElementById("formToggle").innerHTML =
    (gSearchFormHidden ? "Show" : "Hide") + " Search Filters"),
    setTimeout(function () {
      document.getElementById(kSearchFormContainerID).style.display =
        gSearchFormHidden ? "none" : "";
    }, 10);
}
addLoadCode(init),
  String.prototype.trim ||
    (String.prototype.trim = function () {
      return this.replace(/^\s+|\s+$/g, "");
    });
var kTypeMenuItemNames = [
    "<i class='fas fa-home'></i> Houses",
    "<i class='fas fa-building'></i> Apartments",
    "&rdsh; Pets Allowed",
    "&rdsh; Corner Unit",
    "&rdsh; End Unit",
    "&rdsh; Ground Level Unit",
    "&rdsh; Inside Unit",
    "&rdsh; Upper Unit",
    "&rdsh; Penthouse",
    "<i class='fas fa-hotel'></i> Townhouses",
    "&rdsh; Only Duplexes",
    "&rdsh; No Duplexes",
    "<i class='fas fa-caravan'></i> Manufactureds on Pad",
    "<i class='fas fa-city'></i> Multi-Family",
    "<i class='fas fa-tree'></i> Vacant Lots",
    "<i class='fas fa-city'></i> Commercial",
  ],
  kTypeMenuItemValues = [
    "HSE",
    "APT",
    "APT-Pets",
    "APT-Corner Unit",
    "APT-End Unit",
    "APT-Ground Level Unit",
    "APT-Inside Unit",
    "APT-Upper Unit",
    "APT-Penthouse",
    "TWN",
    "TWN-Only Duplexes",
    "TWN-No Duplexes",
    "PAD",
    "MUF",
    "LND",
    "COM",
  ],
  kTypeMenuValuesResidential = ["HSE", "APT", "TWN", "PAD", "MUF", "LND"],
  kTypeMenuValuesCommercial = ["COM"],
  kTypeMenuValuesAll = ["HSE", "APT", "TWN", "PAD", "MUF", "LND", "COM"],
  kTypeMenuTitleResidential = "Residential Types",
  kTypeMenuTitleCommercial = "Commercial Types",
  kTypeMenuTitleAll = "All Property Types",
  kTypeMenuValueDefault = kTypeMenuValuesResidential,
  kTypeMenuTitleDefault = kTypeMenuTitleResidential,
  kTypeMenuButtonTextResidential = kTypeMenuTitleResidential,
  kTypeMenuButtonValueResidential = kTypeMenuValuesResidential,
  kTypeMenuButtonTextCommercial = kTypeMenuTitleCommercial,
  kTypeMenuButtonValueCommercial = kTypeMenuValuesCommercial,
  kTypeMenuID = "typeMenu",
  kTypeMenuZindex = 1e4,
  gTypeMenuValue = [],
  gTypeMenuItemClicked = "";
function initTypeMenu() {
  ((gTypeMenuButton = document.createElement("div")).className = "multiPopup"),
    (gTypeMenuButton.onclick = function () {
      var e,
        t,
        o,
        r = "";
      for (
        gTypeMenuPanel &&
          document.getElementById(kTypeMenuID).removeChild(gTypeMenuPanel),
          (gTypeMenuPanel = document.createElement("div")).id = "typeMenuPanel",
          gTypeMenuPanel.style.cssText =
            "position: absolute; top: 0px; right: 0px; background-color: #E8E8E8; overflow: auto; text-align: left; font-family: Arial, sans-serif; font-size: 10pt; font-weight: normal; white-space: nowrap; border: 1px solid black; z-index: " +
            kTypeMenuZindex +
            ";",
          gTypeMenuPanel.onchange = function (e) {
            var t,
              o,
              r,
              a,
              i = this.getElementsByTagName("input");
            if ((t = gTypeMenuItemClicked.indexOf("-")) > -1)
              (o = gTypeMenuItemClicked.substring(0, t)),
                (i[(t = kTypeMenuItemValues.indexOf(o))].checked = !1);
            else
              for (a of i)
                (r = gTypeMenuItemClicked + "-"),
                  a.value.startsWith(r) && (a.checked = !1);
            for (a of ((gTypeMenuValue = []), i))
              a.checked && gTypeMenuValue.push(a.value);
            if (0 == gTypeMenuValue.length)
              for (a of ((gTypeMenuValue = kTypeMenuValueDefault), i))
                a.checked = in_array(a.value, gTypeMenuValue);
            e.stopPropagation(), typeMenuAction();
          },
          r += "<div style='padding: 0 4px 2px 4px;'>",
          r +=
            "<div style='text-align: center; padding-bottom: 1px; border-bottom: 1px solid black; margin-bottom: 2px;'>",
          r += "<div style='font-weight: bold; font-variant: small-caps;'>",
          r += "property types",
          r += "</div>",
          r +=
            "<button class='" +
            kButtonSizeClass +
            "' type='button' onclick='gTypeMenuValue = kTypeMenuButtonValueResidential; typeMenuSet(true); typeMenuAction();'>" +
            kTypeMenuButtonTextResidential +
            "</button>",
          r += "<br>",
          r +=
            "<button class='" +
            kButtonSizeClass +
            "' type='button' onclick='gTypeMenuValue = kTypeMenuButtonValueCommercial; typeMenuSet(true); typeMenuAction();'>" +
            kTypeMenuButtonTextCommercial +
            "</button>",
          r += "</div>",
          e = 0;
        e < kTypeMenuItemNames.length;
        e++
      )
        (t = kTypeMenuItemNames[e]),
          (o = kTypeMenuItemValues[e]),
          (r += "<label style='cursor: pointer;'>"),
          (r +=
            "<div onmouseover='typeMenuHighlightRow(this, true);' onmouseout='typeMenuHighlightRow(this, false);' style='padding: 3px 0px;'>"),
          (r +=
            "<div style='" +
            (o.indexOf("-") > -1 ? "margin-left: 10px; " : "") +
            "padding-right: 4px;'>"),
          (r +=
            "<input type='checkbox' onclick='gTypeMenuItemClicked = this.value;' value='" +
            o +
            "'" +
            (in_array(o, gTypeMenuValue) ? " checked" : "") +
            ">&nbsp;" +
            t),
          (r += "</div>"),
          (r += "</div>"),
          (r += "</label>");
      (r +=
        "<div style='text-align: center; margin-top: 2px; border-top: 1px solid black; padding: 2px 0 0 0;'>"),
        (r +=
          "<button class='" +
          kButtonSizeClass +
          "' type='button' style='color: red; font-weight: bold; border: 2px solid black;' onclick='typeMenuSet(false);'>Done</button>"),
        (r += "</div>"),
        (r += "</div>"),
        (gTypeMenuPanel.innerHTML = r),
        (gTypeMenuPanel.style.top = this.offsetTop + "px"),
        (gTypeMenuPanel.style.left = this.style.left),
        ((gTypeMenuModal = document.createElement("div")).className = "modal"),
        (gTypeMenuModal.style.zIndex = kTypeMenuZindex - 1),
        document.getElementById(kTypeMenuID).appendChild(gTypeMenuModal),
        document.getElementById(kTypeMenuID).appendChild(gTypeMenuPanel),
        (gTypeMenuPanel.style.display = "block"),
        typeMenuResize();
    }),
    document.getElementById(kTypeMenuID).appendChild(gTypeMenuButton),
    window.addEventListener("resize", function () {
      typeMenuResize();
    });
}
function typeMenuHighlightRow(e, t) {
  t
    ? ((e.style.backgroundColor = "#387BF5"), (e.style.color = "white"))
    : ((e.style.backgroundColor = "initial"), (e.style.color = "black"));
}
function typeMenuSet(e) {
  var t,
    o,
    r,
    a = document.getElementById(kTypeMenuID).getElementsByTagName("input");
  if (e) {
    if (a) for (r of a) r.checked = in_array(r.value, gTypeMenuValue);
  } else
    gTypeMenuPanel && (gTypeMenuPanel.style.display = "none"),
      gTypeMenuModal && (gTypeMenuModal.style.display = "none");
  typeMenuArrayEqual(gTypeMenuValue, kTypeMenuButtonValueResidential)
    ? (o = kTypeMenuButtonTextResidential)
    : typeMenuArrayEqual(gTypeMenuValue, kTypeMenuButtonValueCommercial)
    ? (o = kTypeMenuButtonTextCommercial)
    : typeMenuArrayEqual(gTypeMenuValue, kTypeMenuValuesAll)
    ? (o = kTypeMenuTitleAll)
    : gTypeMenuValue.length > 1
    ? (o = "Multiple Types&hellip;")
    : 1 == gTypeMenuValue.length &&
      (t = kTypeMenuItemValues.indexOf(gTypeMenuValue[0])) > -1
    ? (o = kTypeMenuItemNames[t])
    : ((o = kTypeMenuTitleDefault), (gTypeMenuValue = kTypeMenuValueDefault)),
    (gTypeMenuButton.style.color = "red"),
    (gTypeMenuButton.innerHTML = o + "&nbsp;<i class='fas fa-angle-down'></i>");
}
function typeMenuArrayEqual(e, t) {
  var o = t.slice().sort();
  return (
    e.length === t.length &&
    e
      .slice()
      .sort()
      .every(function (e, t) {
        return e === o[t];
      })
  );
}
function typeMenuResize() {
  if (document.getElementById("typeMenuPanel")) {
    var e =
      (window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight) -
      document.getElementById("typeMenuPanel").getBoundingClientRect().top -
      document.getElementById(kTitleContainerID).offsetHeight;
    document.getElementById("typeMenuPanel").style.maxHeight = e + "px";
  }
}
function typeMenuAction() {
  doChange(!0), savePreferences();
}
function getURL() {
  var e,
    t,
    o,
    r,
    a = kListClientURL;
  for (r of ((a += "?map=" + kMapName),
  gSearchForm.town.value != kTownEverywhereCode &&
    (a += "&town=" + gSearchForm.town.value),
  (a += "&types=" + gTypeMenuValue.join(",")),
  (a += "&status=" + gSearchForm.status.value),
  "active" == gSearchForm.status.value
    ? ("" != (e = gSearchForm.ageactive.value) &&
        (e == gDateAddedValue && (e = gDateAddedName), (a += "&month=" + e)),
      "" != (e = gSearchForm.agePriceChangeFilter.value) &&
        (e == gDateAddedPriceChangeValue && (e = gDateAddedPriceChangeName),
        (a += "&monthPrice=" + e)))
    : "" != (e = gSearchForm.agesold.value) &&
      (e == gDateAddedValue && (e = gDateAddedName), (a += "&month=" + e)),
  gSearchForm.pricelow.value > 0 &&
    (a += "&minPrice=" + gSearchForm.pricelow.value),
  gSearchForm.pricehigh.value > 0 &&
    (a += "&maxPrice=" + gSearchForm.pricehigh.value),
  gSearchForm.bedrooms.value > 0 &&
    (a += "&minBeds=" + gSearchForm.bedrooms.value),
  gSearchForm.bathrooms.value > 0 &&
    (a += "&minBaths=" + gSearchForm.bathrooms.value),
  gSearchForm.housesizelow.value > 0 &&
    (a += "&minHouseSize=" + gSearchForm.housesizelow.value),
  gSearchForm.housesizehigh.value > 0 &&
    (a += "&maxHouseSize=" + gSearchForm.housesizehigh.value),
  gSearchForm.houseage.value != kHouseAgeAll &&
    (a += "&maxHouseAge=" + gSearchForm.houseage.value),
  gSearchForm.lotsizelow.value > 0 &&
    (a += "&minLotSize=" + gSearchForm.lotsizelow.value),
  gSearchForm.lotsizehigh.value > 0 &&
    (a += "&maxLotSize=" + gSearchForm.lotsizehigh.value),
  gSearchForm.parkinginfo.value != kParkingAll &&
    (a += "&parking=" + gSearchForm.parkinginfo.value),
  (t = []),
  kFeatureCheckboxes))
    gSearchForm.elements[r].checked && t.push(r);
  for (r of (t.length > 0 && (a += "&features=" + t.join(",")),
  (o = []),
  kFlagCheckboxes))
    gSearchForm.elements[r].checked && o.push(r);
  return (
    o.length > 0 && (a += "&flags=" + o.join(",")),
    gSearchForm.openhouseday.value != kOpenHouseDayDefault &&
      (a += "&openHouseDay=" + gSearchForm.openhouseday.value),
    gSearchForm.query.value && (a += "&query=" + gSearchForm.query.value),
    gTableListFlag && (a += "&table=1"),
    (a += "&sort=" + gSortOrder),
    gSearchFormHidden && (a += "&hideForm=1"),
    gAgentList && (a += "&agentList=" + gAgentList),
    gAgentBuy && (a += "&agentBuy=" + gAgentBuy),
    gAgentDeal && (a += "&agentDeal=" + gAgentDeal),
    gBrokerageList && (a += "&brokerageList=" + gBrokerageList),
    gBrokerageBuy && (a += "&brokerageBuy=" + gBrokerageBuy),
    gBrokerageDeal && (a += "&brokerageDeal=" + gBrokerageDeal),
    a
  );
}
function copyURL(e) {
  var t = document.createElement("div"),
    o = document.getElementById(kURLFieldID);
  (o.value = getURL()),
    o.select(),
    o.setSelectionRange(0, 99999),
    document.execCommand("copy"),
    o.blur(),
    (t.style.cssText =
      "position: absolute; top: 0px; right: 0px; font-size: smaller; font-weight: bold; color: black; background-color: yellow; white-space: nowrap; padding: 4px; border: 1px solid black; margin-right: " +
      (e.offsetWidth + 2) +
      "px; "),
    (t.innerHTML = "URL copied"),
    e.appendChild(t),
    setTimeout(function () {
      e.removeChild(t);
    }, 1500);
}
function showDescription(e) {
  var t,
    o,
    r,
    a,
    i,
    l,
    n,
    s,
    d = "",
    g = getIndexFromID(e);
  if (g > -1) {
    if (
      ((o = "" == (t = propertyDB[g]).theCity ? t.theTown : t.theCity),
      (r = t.theTown != o ? t.theTown : ""),
      (a = t.theStatus),
      (d +=
        "<div style='font-size: large; font-weight: bold; text-align: center;'>"),
      (d += t.theStreetAddress),
      (d += "<br>"),
      (d += o + " " + t.theProvince),
      (d += "<span style='font-size: smaller;'>"),
      r && (d += " (" + r + ")"),
      t.thePostalCode && (d += " " + t.thePostalCode),
      (d += "</span>"),
      (d += "<div style='font-size: x-large; color: green;'>"),
      (d += formatPrice(t.thePrice)),
      (d += "<span style='color: black; font-size: small;'>"),
      "A" == a ? (a = "For Sale") : "S" == a && (a = "Sold"),
      (d += "&nbsp;"),
      (d += a),
      (d += "</span>"),
      (d += "</div>"),
      (d += "</div>"),
      (d += "<hr>"),
      (d +=
        "<div style='padding: 5px; border: 1px solid black; border-radius: 5px; background-color: lightyellow;'>"),
      (d += t.theDescription),
      (d += "</div>"),
      (l = t.theRooms),
      (n = t.theBathrooms),
      gUserName && l.length > 0)
    ) {
      if (
        ((d +=
          "<div style='font-size: large; font-weight: bold; text-align: center; margin-top: 10px;'>"),
        (d += "Room Information"),
        (d += "</div>"),
        (d += "<table class='stripedTable'>"),
        l.length > 0 || n.length > 0)
      ) {
        for (i of l)
          (d += "<tr>"),
            l &&
              ((d +=
                "<td style='text-align: left; font-weight: bold;'>" +
                (s = i.split("/"))[0] +
                "</td>"),
              (d += "<td style='text-align: center;'>" + s[1] + "</td>"),
              (d +=
                "<td style='text-align: right; white-space: nowrap;'>" +
                s[2] +
                "</td>")),
            (d += "</tr>");
        for (i of (l.length > 0 &&
          (d += "<tr><td colspan='3'>&nbsp;</td></tr>"),
        n))
          (d += "<tr>"),
            i &&
              ((d +=
                "<td style='text-align: left; font-weight: bold;'>Bathroom" +
                ("Y" == (s = i.split("/"))[1] ? " (ensuite)" : "") +
                "</td>"),
              (d += "<td style='text-align: center;'>" + s[0] + "</td>"),
              (d +=
                "<td style='text-align: right; white-space: nowrap;'>" +
                s[2] +
                "</td>")),
            (d += "</tr>");
      }
      d += "</table>";
    }
    (d += "<div style='margin-top: 10px; text-align: center;'>"),
      (d +=
        "<button class='tall' type='button' onclick='showDataSheet(\"" +
        e +
        "\");'>"),
      (d += "<i class='fas fa-external-link-alt'></i>"),
      (d += "&nbsp;"),
      (d += "Show Expanded Information Sheet"),
      (d += "</button>"),
      showModalDialog((d += "</div>"), modalEscHandler, null);
  }
}
function initModalDialog() {
  (gModalBox = document.getElementById("modal-box")),
    (gModalBoxStyle = window.getComputedStyle(
      document.getElementById("modal-frame")
    )),
    (gModalBoxKeyHandler = null),
    (gModalBoxResizeHandler = null),
    (document.getElementById("modal-close-box").onclick = function () {
      hideModalDialog();
    });
}
function showModalDialog(e, t, o) {
  t &&
    ((gModalBoxKeyHandler = t),
    document.addEventListener("keydown", gModalBoxKeyHandler)),
    o &&
      ((gModalBoxResizeHandler = o),
      window.addEventListener("resize", gModalBoxResizeHandler)),
    (document.getElementById("modal-content").innerHTML = e),
    (gModalBox.style.display = "block"),
    setTimeout(function () {
      document.getElementById("modal-frame").scrollTop = 0;
    }, 10);
}
function hideModalDialog() {
  (document.getElementById("modal-frame").style.cssText = gModalBoxStyle),
    (gModalBox.style.display = "none"),
    gModalBoxKeyHandler &&
      document.removeEventListener("keydown", gModalBoxKeyHandler),
    gModalBoxResizeHandler &&
      window.removeEventListener("resize", kPhotoResizeHandler),
    (gModalBoxKeyHandler = null),
    (gModalBoxResizeHandler = null);
}
function modalEscHandler(e) {
  27 == (e = e || window.event).keyCode && hideModalDialog();
}
function installVisibilityHandler() {
  void 0 !== document.hidden
    ? ((gHiddenVH = "hidden"), (gVisibilityChangeVH = "visibilitychange"))
    : void 0 !== document.msHidden
    ? ((gHiddenVH = "msHidden"), (gVisibilityChangeVH = "msvisibilitychange"))
    : void 0 !== document.webkitHidden &&
      ((gHiddenVH = "webkitHidden"),
      (gVisibilityChangeVH = "webkitvisibilitychange")),
    document.addEventListener(gVisibilityChangeVH, handleVisibilityChange, !1);
}
function handleVisibilityChange() {
  document[gHiddenVH] || (refreshFavorites(), refreshRejected());
}
function refreshRejected() {
  var e, t;
  for (e of ((gRejectedList =
    gUserName && (t = userGet(kRejectedCookie))
      ? (gRejectedList = t.split(",")).filter(function (e, t) {
          return gRejectedList.indexOf(e) == t;
        })
      : []),
  propertyDB))
    setRejected("rejected", e.theMLSnumber);
}
function setRejected(e, t) {
  if (getIndexFromID(t) > -1) {
    var o = document.getElementById(e + "-" + t);
    o &&
      (in_array(t, gRejectedList)
        ? (o.setAttribute("class", "fa-solid fa-thumbs-down"),
          o.setAttribute("title", " Remove from rejected list "))
        : (o.setAttribute("class", "fa-regular fa-thumbs-down"),
          o.setAttribute("title", " Add to rejected list ")));
  }
}
function refreshFavorites() {
  var e, t;
  if (gUserName) {
    if (((gFavoritesList = []), (t = userGet(kFavoritesCookie))))
      for (e of ((gFavoritesList = (gFavoritesList = t.split(",")).filter(
        function (e, t) {
          return gFavoritesList.indexOf(e) == t;
        }
      )),
      propertyDB)) {
        e.isMarked = in_array(e.theMLSnumber, gFavoritesList);
        try {
          setFavorite("favorite", e.theMLSnumber);
        } catch (o) {}
      }
    gSearchForm.favorite.checked;
  }
}
function installFocusHandler() {
  window.addEventListener("focus", handleFocusEvent, !1);
}
function handleFocusEvent() {
  refreshFavorites(), refreshRejected();
}
function getRandomAgentByRegion(e) {
  var t,
    o,
    r = [];
  if (e)
    for (t = 0; t < kPartnerAgents.length; t++)
      for (o of kPartnerAgents[t].regions) o == e && r.push(t);
  r.length > 0
    ? ((t = r[(t = Math.floor(Math.random() * r.length))]),
      (gReferralAgent = !0))
    : ((t = 0), (gReferralAgent = !1)),
    setAgentInfo(t);
}
function setAgentInfo(e) {
  (kAgentName = kPartnerAgents[e].name),
    (kAgentPhone = kPartnerAgents[e].phone),
    (kAgentEmail = kPartnerAgents[e].email),
    (kAgentPhotoURL = kPartnerAgents[e].photo),
    (kAgentWebSite = kPartnerAgents[e].website),
    (kAgentBizName = kPartnerAgents[e].bizName),
    (kAgentBrokerageName = kPartnerAgents[e].brokerage.name),
    (kAgentBrokerageAddress = kPartnerAgents[e].brokerage.address),
    (kAgentBrokerageLogoURL = kPartnerAgents[e].brokerage.logoSmall.url),
    (kAgentBrokerageLogoWidth = kPartnerAgents[e].brokerage.logoSmall.width),
    (kAgentBrokerageLogoHeight = kPartnerAgents[e].brokerage.logoSmall.height),
    (kAgentBrokerageLogoBigURL = kPartnerAgents[e].brokerage.logoBig.url),
    (kAgentBrokerageLogoBigWidth = kPartnerAgents[e].brokerage.logoBig.width),
    (kAgentBrokerageLogoBigHeight = kPartnerAgents[e].brokerage.logoBig.height);
}
function showSmartInfo() {
  var e = "";
  (e +=
    "<div style='font-size: x-large; font-weight: bold; text-align: center;'>"),
    (e += "<i class='fas fa-search zealty'></i>"),
    (e += "&nbsp;"),
    (e += "Smart Search Info"),
    (e += "</div>"),
    (e += "<hr>"),
    (e += "<div>"),
    (e += "<div>"),
    (e +=
      'A Smart Search looks for a specific keyword or phrase that appears in the property\'s MLS&reg; Number, Street Address, Strata Building Name, Neighbourhood Name, City, Postal Code, Province, Description, Features &amp; Amenities, Rules, Suite, and Zoning fields. Here are a few examples: <span style=\'font-style: italic;\'>R1234567, "Redrooffs Road", "V5T 2A1", "tennis court", "wok kitchen", "leed gold", "heated floors", "priced to sell", "sharply priced", "below assessed value", "lot value", "move in ready", discount, TLC, "fixer upper", "pride in ownership", "tear down", investment, renovated, cul-de-sac, 55+, R-1</span>.'),
    (e += "</div>"),
    (e += "<div style='margin-top: 10px;'>"),
    (e +=
      '<strong>Advanced Smart Searches</strong>. If you enter multiple words in the Smart Search box, the search looks for a property that includes <em>all</em> the words <em>in any order</em>. (Words can be separated by a space or a comma.) If order is important, put the words in quotation marks: <em><strong>"pride in ownership"</strong></em>, for example, finds properties where these three words appear in the order specified.'),
    (e += "</div>"),
    (e += "<div style='margin-top: 10px;'>"),
    (e +=
      "If you want to to look for <em>any one or more</em> of a group of words, enclose the words in parentheses: <em><strong>(squash, tennis) court</strong></em>, for example, will find properties containing the words <em><strong>squash</strong></em> or <em><strong>tennis</strong></em> as well as the word <em><strong>court</strong></em>."),
    (e += "</div>"),
    (e += "<div style='margin-top: 10px;'>"),
    (e +=
      "To look for properties that do <em>not</em> contain a particular word, put a <em>hyphen</em> in front of the word. For example, <em><strong>Kitsilano -waterfront</strong></em> would find properties in Kitsilano that are not on the waterfront."),
    (e += "</div>"),
    (e += "</div>"),
    (e += "<div class='note' style='margin-top: 10px;'>"),
    (e +=
      "NOTE: Smart Searches also include the criteria specified in the Search Filters dialog box."),
    (e += "</div>"),
    (e += "</div>"),
    (e += "<hr>"),
    (e +=
      "<div style='font-size: large; font-weight: bold; text-align: left;'>"),
    (e += "Examples"),
    (e += "</div>"),
    (e += "<table style='width: 100%;' cellpadding'5'>"),
    (e +=
      "<tr style='text-align: left; color: white; background-color: black;'>"),
    (e += "<th>"),
    (e += "Description"),
    (e += "</th>"),
    (e += "<th>"),
    (e += "Search Command"),
    (e += "</th>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "Exclude 55+ communities"),
    (e += "</td>"),
    (e +=
      "<td style='font-weight: bold; text-decoration: underline; cursor: pointer;' onclick='gSearchForm.elements[kKeywordFilter].value = \"-55+\"; hideModalDialog(); doSearch(1, true);'>"),
    (e += "-55+"),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "Properties on E 10th Avenue in postal code area V5T"),
    (e += "</td>"),
    (e +=
      "<td style='font-weight: bold; text-decoration: underline; cursor: pointer;' onclick='gSearchForm.elements[kKeywordFilter].value = \"\\\"E 10th Avenue\\\" V5T\"; hideModalDialog(); doSearch(1, true);'>"),
    (e += '"E 10th Avenue" V5T'),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "Electric vehicle chargers"),
    (e += "</td>"),
    (e +=
      "<td style='font-weight: bold; text-decoration: underline; cursor: pointer;' onclick='gSearchForm.elements[kKeywordFilter].value = \"(EV, Tesla) charging\"; hideModalDialog(); doSearch(1, true);'>"),
    (e += "(EV, Tesla) charging"),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "In the Board's Mount Pleasant VE neighbourhood"),
    (e += "</td>"),
    (e +=
      "<td style='font-weight: bold; text-decoration: underline; cursor: pointer;' onclick='gSearchForm.elements[kKeywordFilter].value = \"\\\"Mount Pleasant VE\\\"\"; hideModalDialog(); doSearch(1, true);'>"),
    (e += '"Mount Pleasant VE"'),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "Properties on Langara or Belmont Avenues"),
    (e += "</td>"),
    (e +=
      '<td style=\'font-weight: bold; text-decoration: underline; cursor: pointer;\' onclick=\'gSearchForm.elements[kKeywordFilter].value = "(\\"Langara Avenue\\", \\"Belmont Avenue\\")"; hideModalDialog(); doSearch(1, true);\'>'),
    (e += '("Langara Avenue", "Belmont Avenue")'),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "<tr>"),
    (e += "<td>"),
    (e += "Property needs work"),
    (e += "</td>"),
    (e +=
      "<td style='font-weight: bold; text-decoration: underline; cursor: pointer;' onclick='gSearchForm.elements[kKeywordFilter].value = \"(TLC, fixer, \\\"sweat equity\\\")\"; hideModalDialog(); doSearch(1, true);'>"),
    (e += '(TLC, fixer, "sweat equity")'),
    (e += "</td>"),
    (e += "</tr>"),
    (e += "</table>"),
    (e += "<hr>"),
    (e += "<div style='text-align: center;'>"),
    (e +=
      "<button id='okButtonSmart' class='" +
      kButtonSizeClass +
      "' type='submit' onclick='hideModalDialog();'>OK</button>"),
    showModalDialog((e += "</div>"), modalEscHandler),
    document.getElementById("okButtonSmart").focus();
}
window.onclick = function (e) {
  e.target == gTypeMenuModal && typeMenuSet(!1);
};
