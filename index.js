
const s = GP.load();
const root = GP.$('#page-root');
root.appendChild(GP.kpiCards(s));

// Quick links
const links = GP.el('div',{class:'grid'},[
  GP.card('Post an Idle Ticket','→','Jump to Idle Tickets to signal availability.'),
  GP.card('Create a Quest','→','Managers can publish quests with rewards.'),
  GP.card('View Quest Board','→','Filter by class & status.'),
  GP.card('See Analytics','→','Charts by class and department.'),
]);
root.appendChild(links);

