const Dashboard = () => {
    return (
        <div className="mx-56 my-9 font-bold min-w-max">
            <div className="text-xl md:text-2xl lg:text-3xl">Dashboard</div>

            <div className="my-8 h-1/4 min-h-48  min-w-['1rem'] bg-white rounded-lg">
                <div className="p-4 md:p-8 hover:text-[#464BD8] max-w-48">Total Summary</div>
                <div className="flex my-2 px-8 font-semibold text-gray-500">
                    <div>
                        <div>Total amount you owe</div>
                        <div>$12,000.00</div>
                    </div>
                    <div className="p-1 ml-36">
                        <div>Total amount owe to you</div>
                        <div>$6,000.00</div>
                    </div>
                    <div className="p-1 ml-36">
                        <div>Total outstanding balance</div>
                        <div>$100.00</div>
                    </div>
                </div>
            </div>
            <div className="my-8 h-1/4 min-h-48 bg-white rounded-lg">
                <div className="p-8 hover:text-[#464BD8] max-w-56">Friends Summary</div>
                <div className="flex my-2 px-8 font-semibold text-gray-500">
                    <div className="p-1">
                        <div>Friends you owe</div>
                        <div className="flex my-4">
                            <div>Ironman</div>
                            <div className="ml-4">$1,000.00</div>
                        </div>
                    </div>
                    <div className="p-1 ml-40">
                        <div>Friends owe to you</div>
                        <div className="flex my-4">
                            <div>Ironman</div>
                            <div className="ml-4">$1,000.00</div>
                        </div>
                    </div>
                    <div className="p-1 ml-32">
                        <div>Friends with outstanding balance</div>
                        <div className="flex my-4">
                            <div>Ironman</div>
                            <div className="ml-4">$1,000.00</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="my-8 h-1/4 min-h-48 bg-white rounded-lg">
                <div className="p-8 hover:text-[#464BD8] max-w-56">Groups Summary</div>
            </div>
        </div>
    )
}

export default Dashboard