export default `
/* 隐藏元素 */
.lmt-icon,
.af-select-icon-item,
.market-size,
.view-all,
.print-footer,
.tour-item,
.sport-name-item,
.game-id-label,
.left-arrow,
.market-group,
.dis-icon,
.m-livetracker,
.sr-widget {
  display: none!important;
}
/* 显示被隐藏元素 */
.sport-name-item.active,
.tour-item.active {
  display: block!important;
}
/* header */
.print-logo {
  padding: 8px 0;
}
.print-logo img {
  height: 30px;
}
/* title */
.sport-name,
.print-title {
  border-top: 2px solid #000;
  text-transform: capitalize;
}
.sport-name-item.active,
.print-title {
  text-align: center;
  font-size: 16px;
  font-weight: bold;
  padding: 4px 6px;
}
/* 联赛 */
.date {
  font-size: 11px;
  padding-left: 6px;
}
.tour-item.active,
.leage-title,
#print-container-live .league {
  background: #d6d5d5;
  padding: 3px 6px 4px;
}
.leage-title {
  font-size: 13px!important;
}
.tour-item.active > div {
  display: inline-block;
  font-size: 13px;
}
.match-leage {
  margin-bottom: 20px;
}
/* table */
.m-table-row {
  border-top: 1px solid #bfbfbf;
  overflow: hidden;
  font-size: 8px;
}
.left-team-table {
  padding: 5px 0;
}
.m-outcome {
  padding: 6px 0;
}
.each-module-wrap .two-markets:nth-child(2) .each-module:first-child,
.specifiers-select {
  background-color: #d6d5d5;
}
.date-row,
#print-container-live .league-row {
  border-top: 0;
  padding: 0;
  margin: 3px 0 0 0;
}
.m-table-cell {
  float: left;
}
.m-table-cell > div {
  overflow: hidden;
}
.date-row .date,
.league {
  float: none;
}
.date-row .each-module-wrap,
.p-table-th {
  border-top: 1px solid #333;
  margin-top: 6px;
}
.market-cell, .each-module-wrap {
  float: right;
}
.p-table-th, .each-module-wrap {
  overflow: hidden;
  font-size: 7px;
}
.p-table-th > div,
.each-module {
  padding: 3px 0;
}

.p-table-th > div {
  float: left;
  min-width: 37px;
  padding-left: 4px;
}
.p-table-th .event {
  padding-left: 4px;
  min-width: 196px;
}

.left-team-table > div {
  float: left;
}
.each-module-table,
.m-market {
  float: left;
  overflow: hidden;
}
.left-team-table {
  overflow: hidden;
}
.each-module,
.m-outcome {
  min-width: 37px;
  text-align: center;
  float: left;
}

.time > div {
  min-width: 37px;
  display: inline-block;
  padding-left: 4px;
  text-align: left;
}
.teams {
  padding-left: 4px;
  min-width: 200px;
  word-wrap: break-word;
}
.teams > div {
  display: inline-block;
}
.game-id {
  float: left;
}
.home-team:after {
  content: '-';
  margin-left: 4px;
}
#print-container-live .m-table {
  margin-bottom: 20px;
}
#print-container-live .teams > div {
  display: block;
}
#print-container-live .home-team:after {
  content: '';
  margin: 0;
}
#print-container-live .m-content-row .two-markets,
#print-container-live .m-content-row .time {
  line-height: 2;
}
#print-container-live .league-row {
  padding-bottom: 0;
  position: relative;
}
#print-container-live .league {
  margin-bottom: 16px;
}
#print-container-live .market-desc-wrap > div {
  float: left;
  width: 50%;
  text-align: center;
}
#print-container-live .each-module-two-line > div {
  margin-top: 0;
}
#print-container-live .each-module-two-line {
  margin-top: -14px;
  padding: 0;
  position: absolute;
  right: 0;
  bottom: -1px;
}
#print-container-live .each-module-two-line .each-module {
  padding: 4px 0 3px;
}
#print-container-live .each-module-two-line .market-desc {
  padding: 3px 0;
}
#print-container-live .each-module-two-line .market-desc-wrap {
  border-top: 0;
}
#print-container-live .score,
#print-container-live .game-score,
#print-container-live .point {
  float: left;
  margin: 0 6px;
}
`;
