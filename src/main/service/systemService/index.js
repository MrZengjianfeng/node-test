class SystemService {
    // 获取系统列表
    getSystemList() {
        // 模拟数据
        const systemList = [
            { id: 1, name: 'Authentication Service', status: 'active' },
            { id: 2, name: 'Payment Service', status: 'active' },
            { id: 3, name: 'Notification Service', status: 'inactive' }
        ];

        return systemList;
    }

    // 分页获取系统列表
    getSystemListPage(page = 1, size = 10) {
        const systemList = this.getSystemList();

        const start = (page - 1) * size;
        const end = start + size;
        const paginatedList = systemList.slice(start, end);

        return {
            list: paginatedList,
            total: systemList.length,
            page: page,
            size: size
        };
    }

    // 根据状态分组系统信息
    getSystemsGroupedByStatus() {
        // 模拟按状态分组的数据
        const groupedData = {
            active: [
                { id: 1, name: 'Authentication Service' },
                { id: 2, name: 'Payment Service' }
            ],
            inactive: [
                { id: 3, name: 'Notification Service' }
            ],
            maintenance: []
        };

        return groupedData;
    }
}

module.exports = new SystemService();