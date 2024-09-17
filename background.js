chrome.webNavigation.onCommitted.addListener(handleNavigation);
chrome.webNavigation.onHistoryStateUpdated.addListener(handleNavigation);

//Posts Top can sort by time period.
// Main page Top can sort by time period. 
// Main page Hot can sort by location.

async function handleNavigation(details) {
    loadHomePage(details);
    loadPostSorting(details);
    loadCommentSorting(details);
}

async function loadHomePage(details) {
	chrome.tabs.get(details.tabId, async function (tab) {
		if (tab.url) {

			const regex = /https:\/\/www\.reddit\.com\/r\/popular\/.+/;
			if (regex.test(tab.url)) {
				return;
			}
			if (tab.url == "https://www.reddit.com/" || tab.url.includes("https://www.reddit.com/r/popular/")) {
				baseUrl = 'https://www.reddit.com/r/popular/';
			} else {
				return
			}

			const savedState = await chrome.storage.local.get("sHp");
			let newUrl;
			switch (savedState.sHp) {
				case "0":
					newUrl = tab.url + 'best';
					break;
				case "2":
					newUrl = tab.url + 'new';
					break;
				case "3":
					newUrl = tab.url + 'top';
					break;
				case "4":
					newUrl = tab.url + 'rising';
				default:
					newUrl = tab.url + 'hot';
			}
			if (newUrl) {
				chrome.tabs.update(details.tabId, { url: newUrl });
			}
		}
	});
}
async function loadPostSorting(details) {
	chrome.tabs.get(details.tabId, async function (tab) {
		if (tab.url) {

			let baseUrl;
			if (tab.url.includes("old.reddit")) {
				baseUrl = 'https://old.reddit.com/r/';
			} else if (tab.url.includes("https://www.reddit.com/r/popular/")) {
				return
			}
			else {
				baseUrl = 'https://www.reddit.com/r/';
			}

			const regex = new RegExp(`^${baseUrl}[^/]+/?$`);
			if (regex.test(tab.url)) {
				const savedState = await chrome.storage.local.get("sSt");
				let newUrl;
				switch (savedState.sSt) {
					case "1":
						newUrl = tab.url + 'new';
						break;
					case "2":
						newUrl = tab.url + 'top';
						break;
					case "3":
						newUrl = tab.url + 'rising';
						break;
					default:
						newUrl = tab.url + 'hot';
				}
				if (newUrl) {
					chrome.tabs.update(details.tabId, { url: newUrl });
				}
			}
		}
	});
}

async function loadCommentSorting(details) {
	chrome.tabs.get(details.tabId, async function (tab) {
		if (tab.url) {

			let regex;
			if (tab.url.includes("old.reddit")) {
				regex = /https:\/\/old\.reddit\.com\/r\/[^/]+\/comments\/[^/]+\/[^/]+\/?/;
			} else {
				regex = /https:\/\/www\.reddit\.com\/r\/[^/]+\/comments\/[^/]+\/[^/]+\/?/;
			}

			if (regex.test(tab.url) && !tab.url.includes('?sort=')) {
				const savedState = await chrome.storage.local.get("sSc");
				let newUrl;
				switch (savedState.sSc) {
					case "0":
						newUrl = tab.url + '?sort=confidence';
						break;
					case "1":
						newUrl = tab.url + '?sort=top';
						break;
					case "2":
						newUrl = tab.url + '?sort=new';
						break;
					case "3":
						newUrl = tab.url + '?sort=controversial';
						break;
					case "4":
						newUrl = tab.url + '?sort=old';
						break;
					case "5":
						newUrl = tab.url + '?sort=qa';
						break;
				}

				if (newUrl) {
					chrome.tabs.update(details.tabId, { url: newUrl });
				}
			}
		}
	});
}