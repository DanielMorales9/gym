export function padding(d, key, hashMap, revHashMap, paddingObject) {
    const data = d.map(v => {
        v.id = hashMap[v[key]];
        return v;
    });

    data.sort((a, b) => a.id - b.id);

    const paddingList = [];
    for (let i = 1; i < data.length; i++) {
        const prevId = data[i - 1].id;
        const curr = data[i];

        if (prevId + 1 !== curr.id) {
            for (let j = prevId + 1; j < curr.id; j++) {
                const p = Object.assign({}, paddingObject);
                p[key] = revHashMap[j];
                paddingList.push(p);
            }
        }
    }

    data.push(...paddingList);
    data.sort((a, b) => a.id - b.id);
    return data;
}

export function feedChart(d, bundleTypeName) {
    const defaultDict = new Proxy({}, {
        get(target, name) {
            if (name in target) {
                return target[name];
            } else {
                return parseInt(name.toString(), undefined);
            }
        }
    });

    const pad = [];
    for (const key in bundleTypeName) {
        const d1 = d.filter(v => v.type === key);
        const p = padding(d1, 'week', defaultDict, defaultDict, { numreservations: 0, type: key });
        pad.push(...p);
    }

    d = pad;
    const labels = d.map(v => v.week).filter((v, i, a) => a.indexOf(v) === i);
    labels.sort((a, b) => a - b);
    const lineChartLabels = labels.map(v => 'Sett. ' + v);
    const lineChartData = [];

    for (const key in bundleTypeName) {
        let data = d.filter(v => v.type === key);
        data.forEach(v => v.week = parseInt(v.week, undefined));
        const labels_dict = {};

        data = data.map(v => labels_dict[v.week] = v.numreservations);

        for (let i = 0; i < labels.length; i++) {
            if (!labels_dict[labels[i]]) {
                labels_dict[labels[i]] = 0;
            }
        }

        data = labels.map(v => labels_dict[v]);
        lineChartData.push({data: data, label: bundleTypeName[key], stack: '1'});
    }
    return [lineChartData, lineChartLabels];
}
