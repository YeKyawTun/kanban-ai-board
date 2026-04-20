jest.mock('../../repositories/TicketRepository');
jest.mock('../../repositories/TeamMemberRepository');
jest.mock('../../utils/idGenerator');
jest.mock('../../utils/dateFormatter');
jest.mock('../../utils/mapper');

const TicketService = require('../TicketService');
const TicketRepository = require('../../repositories/TicketRepository');
const TeamMemberRepository = require('../../repositories/TeamMemberRepository');
const { nextId } = require('../../utils/idGenerator');
const { normalizeDueDate, nowIso } = require('../../utils/dateFormatter');
const { attachAssigneeName } = require('../../utils/mapper');

describe('TicketService.createTicket', () => {
  let ticketRepositoryMock;
  let teamMemberRepositoryMock;
  let ticketService;

  beforeEach(() => {
    jest.clearAllMocks();

    ticketRepositoryMock = {
      findAll: jest.fn(),
      create: jest.fn()
    };

    teamMemberRepositoryMock = {
      findAll: jest.fn()
    };

    TicketRepository.mockImplementation(() => ticketRepositoryMock);
    TeamMemberRepository.mockImplementation(() => teamMemberRepositoryMock);

    nextId.mockReturnValue(101);
    nowIso.mockReturnValue('2026-04-19T12:00:00.000Z');
    normalizeDueDate.mockReturnValue('2026-04-25');
    attachAssigneeName.mockImplementation((ticket) => ({
      ...ticket,
      assigneeName: 'Alice'
    }));

    ticketService = new TicketService();
  });

  test('creates a ticket with trimmed fields, default todo status, and archived false', async () => {
    ticketRepositoryMock.findAll.mockResolvedValue([{ id: 100 }]);
    teamMemberRepositoryMock.findAll.mockResolvedValue([
      { id: 1, name: 'Alice', specialization: 'backend' }
    ]);
    ticketRepositoryMock.create.mockImplementation(async (ticket) => ticket);

    const payload = {
      title: '  Test ticket  ',
      description: '  Test description  ',
      priority: 'medium',
      label: 'backend',
      assigneeId: '1',
      dueDate: '2026-04-25T10:30:00.000Z'
    };

    const result = await ticketService.createTicket(payload);

    expect(ticketRepositoryMock.findAll).toHaveBeenCalledTimes(1);
    expect(teamMemberRepositoryMock.findAll).toHaveBeenCalledTimes(1);

    expect(nextId).toHaveBeenCalledWith([{ id: 100 }]);
    expect(normalizeDueDate).toHaveBeenCalledWith('2026-04-25T10:30:00.000Z');
    expect(nowIso).toHaveBeenCalledTimes(1);

    expect(ticketRepositoryMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 101,
        title: 'Test ticket',
        description: 'Test description',
        status: 'todo',
        priority: 'medium',
        label: 'backend',
        assigneeId: 1,
        dueDate: '2026-04-25',
        createdAt: '2026-04-19T12:00:00.000Z',
        updatedAt: '2026-04-19T12:00:00.000Z',
        archived: false
      })
    );

    expect(attachAssigneeName).toHaveBeenCalled();

    expect(result).toEqual(
      expect.objectContaining({
        id: 101,
        title: 'Test ticket',
        description: 'Test description',
        status: 'todo',
        priority: 'medium',
        label: 'backend',
        assigneeId: 1,
        dueDate: '2026-04-25',
        createdAt: '2026-04-19T12:00:00.000Z',
        updatedAt: '2026-04-19T12:00:00.000Z',
        archived: false,
        assigneeName: 'Alice'
      })
    );
  });
});

